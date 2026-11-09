import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import { GroupAttendance } from '../groups/entities/group-attendance.entity.js';
import { AttendanceStatus } from '../groups/enums/group.enums.js';
import { User } from '../users/entities/user.entity.js';
import { CreatePrayerDto } from './dto/create-prayer.dto.js';
import { LogPastoralVisitDto } from './dto/log-pastoral-visit.dto.js';
import { PrayerQueryDto } from './dto/prayer-query.dto.js';
import { RecordTestimonyDto } from './dto/record-testimony.dto.js';
import { PastoralVisitLog } from './entities/pastoral-visit-log.entity.js';
import { PrayerIntercession } from './entities/prayer-intercession.entity.js';
import { PrayerRequest } from './entities/prayer-request.entity.js';
import { PrayerStatus } from './enums/prayer.enums.js';

@Injectable()
export class PrayersService {
  private readonly logger = new Logger(PrayersService.name);

  constructor(
    @InjectRepository(PrayerRequest)
    private readonly prayerRepo: Repository<PrayerRequest>,
    @InjectRepository(PrayerIntercession)
    private readonly intercessionRepo: Repository<PrayerIntercession>,
    @InjectRepository(PastoralVisitLog)
    private readonly visitLogRepo: Repository<PastoralVisitLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(GroupAttendance)
    private readonly attendanceRepo: Repository<GroupAttendance>,
  ) {}

  async findAll(user: User | null, query: PrayerQueryDto) {
    const { page = 1, limit = 20, category, isAnswered, search } = query;
    const skip = (page - 1) * limit;

    const isPastorOrLeader = user?.role === Role.Admin;

    const qb = this.prayerRepo
      .createQueryBuilder('prayer')
      .where('prayer.status = :status', { status: PrayerStatus.Approved })
      .orderBy('prayer.createdAt', 'DESC');

    // Confidentiality logic: Only pastors/leaders or the author can see confidential prayers
    if (!isPastorOrLeader) {
      if (user?.id) {
        qb.andWhere(
          '(prayer.isConfidential = false OR prayer.userId = :userId)',
          { userId: user.id },
        );
      } else {
        qb.andWhere('prayer.isConfidential = false');
      }
    }

    if (category) {
      qb.andWhere('prayer.category = :category', { category });
    }

    if (isAnswered !== undefined) {
      qb.andWhere('prayer.isAnswered = :isAnswered', { isAnswered });
    }

    if (search && search.trim()) {
      qb.andWhere(
        '(prayer.title LIKE :search OR prayer.content LIKE :search OR prayer.authorName LIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    // Map whether current user has already prayed for each item
    let userIntercessionIds = new Set<string>();
    if (user?.id && items.length > 0) {
      const itemIds = items.map((i) => i.id);
      const intercessions = await this.intercessionRepo.find({
        where: {
          userId: user.id,
          prayerRequestId: In(itemIds),
        },
      });
      userIntercessionIds = new Set(intercessions.map((i) => i.prayerRequestId));
    }

    const enrichedItems = items.map((p) => ({
      ...p,
      hasInterceded: userIntercessionIds.has(p.id),
    }));

    return {
      items: enrichedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, user: User | null) {
    const prayer = await this.prayerRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!prayer) {
      throw new NotFoundException('Không tìm thấy lời cầu thay.');
    }

    const isPastorOrLeader = user?.role === Role.Admin;

    if (prayer.isConfidential && !isPastorOrLeader && prayer.userId !== user?.id) {
      throw new ForbiddenException('Lời cầu thay này được giữ kín nhiệm cho Mục sư.');
    }

    return prayer;
  }

  async create(user: User | null, dto: CreatePrayerDto) {
    let authorName = 'Tín Hữu Hội Thánh';

    if (dto.isAnonymous) {
      authorName = 'Tín Hữu Ẩn Danh';
    } else if (dto.authorName?.trim()) {
      authorName = dto.authorName.trim();
    } else if (user?.fullName) {
      authorName = user.fullName;
    }

    const prayer = this.prayerRepo.create({
      userId: user?.id || null,
      authorName,
      title: dto.title.trim(),
      content: dto.content.trim(),
      category: dto.category,
      isConfidential: dto.isConfidential ?? false,
      isAnonymous: dto.isAnonymous ?? false,
      isAnswered: false,
      prayerCount: 0,
      status: PrayerStatus.Approved,
    });

    return this.prayerRepo.save(prayer);
  }

  async intercede(prayerRequestId: string, userId: string) {
    const prayer = await this.prayerRepo.findOne({
      where: { id: prayerRequestId },
    });

    if (!prayer) {
      throw new NotFoundException('Không tìm thấy lời cầu thay.');
    }

    const existing = await this.intercessionRepo.findOne({
      where: { prayerRequestId, userId },
    });

    if (existing) {
      return {
        alreadyInterceded: true,
        prayerCount: prayer.prayerCount,
        prayer,
      };
    }

    const intercession = this.intercessionRepo.create({
      prayerRequestId,
      userId,
    });

    await this.intercessionRepo.save(intercession);

    prayer.prayerCount += 1;
    const updated = await this.prayerRepo.save(prayer);

    return {
      alreadyInterceded: false,
      prayerCount: updated.prayerCount,
      prayer: updated,
    };
  }

  async recordTestimony(
    prayerRequestId: string,
    user: User,
    dto: RecordTestimonyDto,
  ) {
    const prayer = await this.prayerRepo.findOne({
      where: { id: prayerRequestId },
    });

    if (!prayer) {
      throw new NotFoundException('Không tìm thấy lời cầu thay.');
    }

    const isPastorOrAdmin = user.role === Role.Admin;

    if (!isPastorOrAdmin && prayer.userId !== user.id) {
      throw new ForbiddenException(
        'Chỉ người đăng lời cầu thay hoặc Mục sư mới có thể ghi nhận lời chứng tạ ơn Chúa.',
      );
    }

    prayer.isAnswered = true;
    prayer.praiseReport = dto.praiseReport.trim();

    return this.prayerRepo.save(prayer);
  }

  async getAbsenteeAlerts() {
    // 1. Tín hữu vắng mặt 2 buổi nhóm tế bào liên tiếp
    const recentAbsences = await this.attendanceRepo.find({
      where: { status: AttendanceStatus.Absent },
      relations: { user: true, group: true },
      order: { sessionDate: 'DESC' },
      take: 50,
    });

    // Group absences by user
    const userAbsenceCount: Record<
      string,
      {
        user: User;
        groupName: string;
        absentCount: number;
        lastSessionDate: string;
      }
    > = {};

    for (const record of recentAbsences) {
      if (!record.user) continue;
      const uid = record.user.id;
      if (!userAbsenceCount[uid]) {
        userAbsenceCount[uid] = {
          user: record.user,
          groupName: record.group?.name || 'Nhóm Tế Bào',
          absentCount: 0,
          lastSessionDate: record.sessionDate,
        };
      }
      userAbsenceCount[uid].absentCount += 1;
    }

    // 2. Tín hữu không đăng nhập / không hoạt động trong 14 ngày
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await this.userRepo.find({
      where: [
        {
          role: In([Role.Member, Role.Parent]),
          lastLoginAt: LessThan(fourteenDaysAgo),
        },
      ],
      take: 20,
    });

    // 3. Tra cứu lịch sử thăm viếng gần nhất
    const allAbsenteeUserIds = [
      ...Object.keys(userAbsenceCount),
      ...inactiveUsers.map((u) => u.id),
    ];

    const recentLogs =
      allAbsenteeUserIds.length > 0
        ? await this.visitLogRepo.find({
            where: { memberId: In(allAbsenteeUserIds) },
            order: { visitDate: 'DESC' },
          })
        : [];

    const lastLogByMember: Record<string, PastoralVisitLog> = {};
    for (const log of recentLogs) {
      if (!lastLogByMember[log.memberId]) {
        lastLogByMember[log.memberId] = log;
      }
    }

    const absenteeList = [];

    // Map group absentees
    for (const [uid, info] of Object.entries(userAbsenceCount)) {
      if (info.absentCount >= 2) {
        absenteeList.push({
          memberId: uid,
          fullName: info.user.fullName,
          email: info.user.email,
          phone: info.user.phone || '(469) 555-0182',
          campusId: info.user.campusId || 'Dallas Campus',
          alertReason: `Vắng ${info.absentCount} buổi nhóm tế bào (${info.groupName})`,
          consecutiveWeeks: info.absentCount,
          lastActivityDate: info.lastSessionDate,
          urgency: 'high',
          lastContacted: lastLogByMember[uid] || null,
        });
      }
    }

    // Map inactive app users
    for (const user of inactiveUsers) {
      if (!userAbsenceCount[user.id]) {
        absenteeList.push({
          memberId: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '(972) 555-0144',
          campusId: user.campusId || 'Dallas Campus',
          alertReason: 'Không đăng nhập đọc Lời Chúa trong 14 ngày qua',
          consecutiveWeeks: 2,
          lastActivityDate: user.lastLoginAt
            ? user.lastLoginAt.toISOString()
            : user.createdAt.toISOString(),
          urgency: 'medium',
          lastContacted: lastLogByMember[user.id] || null,
        });
      }
    }

    return {
      totalAlerts: absenteeList.length,
      absentees: absenteeList,
    };
  }

  async logPastoralVisit(pastorId: string, dto: LogPastoralVisitDto) {
    const member = await this.userRepo.findOne({ where: { id: dto.memberId } });
    if (!member) {
      throw new NotFoundException('Không tìm thấy tín hữu.');
    }

    const log = this.visitLogRepo.create({
      pastorId,
      memberId: dto.memberId,
      contactType: dto.contactType || 'phone',
      notes: dto.notes.trim(),
      visitDate: new Date(),
    });

    return this.visitLogRepo.save(log);
  }
}
