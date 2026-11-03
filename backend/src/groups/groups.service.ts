import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SmallGroup } from './entities/small-group.entity.js';
import { GroupMember } from './entities/group-member.entity.js';
import { GroupAttendance } from './entities/group-attendance.entity.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { AddGroupMemberDto } from './dto/group-member.dto.js';
import { BatchAttendanceDto } from './dto/batch-attendance.dto.js';
import { GroupQueryDto } from './dto/group-query.dto.js';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(SmallGroup)
    private readonly groupRepository: Repository<SmallGroup>,
    @InjectRepository(GroupMember)
    private readonly memberRepository: Repository<GroupMember>,
    @InjectRepository(GroupAttendance)
    private readonly attendanceRepository: Repository<GroupAttendance>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: GroupQueryDto) {
    const { page = 1, limit = 20, search, category, zipcode } = query;
    const qb = this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.leader', 'leader')
      .leftJoinAndSelect('group.members', 'members');

    if (category) {
      qb.andWhere('group.category = :category', { category });
    }

    if (zipcode) {
      qb.andWhere('group.zipcode = :zipcode', { zipcode: zipcode.trim() });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(group.name) LIKE :search OR LOWER(group.location) LIKE :search OR group.zipcode LIKE :search)',
        { search: `%${search.toLowerCase().trim()}%` },
      );
    }

    qb.orderBy('group.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<SmallGroup> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: { leader: true, members: { user: true } },
    });

    if (!group) {
      throw new NotFoundException('Không tìm thấy nhóm tế bào');
    }

    return group;
  }

  async create(dto: CreateGroupDto): Promise<SmallGroup> {
    const group = this.groupRepository.create({
      name: dto.name.trim(),
      leaderId: dto.leaderId,
      category: dto.category,
      scheduleRule: dto.scheduleRule.trim(),
      location: dto.location?.trim() ?? null,
      zoomLink: dto.zoomLink?.trim() ?? null,
      zipcode: dto.zipcode?.trim() ?? null,
      description: dto.description?.trim() ?? null,
    });

    const savedGroup = await this.groupRepository.save(group);

    // Tự động thêm Trưởng nhóm vào bảng thành viên
    await this.memberRepository.save(
      this.memberRepository.create({
        groupId: savedGroup.id,
        userId: dto.leaderId,
        role: dto.category ? undefined : undefined,
      }),
    );

    return this.findById(savedGroup.id);
  }

  async update(id: string, dto: UpdateGroupDto): Promise<SmallGroup> {
    const group = await this.findById(id);
    if (dto.name) group.name = dto.name.trim();
    if (dto.leaderId) group.leaderId = dto.leaderId;
    if (dto.category) group.category = dto.category;
    if (dto.scheduleRule) group.scheduleRule = dto.scheduleRule.trim();
    if (dto.location !== undefined) group.location = dto.location?.trim() ?? null;
    if (dto.zoomLink !== undefined) group.zoomLink = dto.zoomLink?.trim() ?? null;
    if (dto.zipcode !== undefined) group.zipcode = dto.zipcode?.trim() ?? null;
    if (dto.description !== undefined) group.description = dto.description?.trim() ?? null;

    await this.groupRepository.save(group);
    return this.findById(id);
  }

  async addMember(groupId: string, dto: AddGroupMemberDto): Promise<GroupMember> {
    await this.findById(groupId); // verify group exists

    const exists = await this.memberRepository.findOne({
      where: { groupId, userId: dto.userId },
    });

    if (exists) {
      throw new ConflictException('Tín hữu này đã tham gia nhóm');
    }

    const member = this.memberRepository.create({
      groupId,
      userId: dto.userId,
      role: dto.role,
    });

    return this.memberRepository.save(member);
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await this.memberRepository.delete({ groupId, userId });
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    return this.memberRepository.find({
      where: { groupId },
      relations: { user: true },
      order: { joinedAt: 'ASC' },
    });
  }

  /**
   * Điểm danh buổi sinh hoạt nhóm hàng loạt (Batch Attendance).
   * Sử dụng Database Transaction để đảm bảo tính toàn vẹn dữ liệu.
   */
  async recordAttendance(
    groupId: string,
    markedById: string,
    dto: BatchAttendanceDto,
  ) {
    await this.findById(groupId);

    return this.dataSource.transaction(async (manager) => {
      const results: GroupAttendance[] = [];

      for (const record of dto.records) {
        let attendance = await manager.findOne(GroupAttendance, {
          where: {
            groupId,
            userId: record.userId,
            sessionDate: dto.sessionDate,
          },
        });

        if (attendance) {
          attendance.status = record.status;
          attendance.notes = record.notes?.trim() ?? null;
          attendance.markedById = markedById;
        } else {
          attendance = manager.create(GroupAttendance, {
            groupId,
            userId: record.userId,
            sessionDate: dto.sessionDate,
            status: record.status,
            notes: record.notes?.trim() ?? null,
            markedById,
          });
        }

        results.push(await manager.save(GroupAttendance, attendance));
      }

      return results;
    });
  }

  async getAttendanceHistory(groupId: string, sessionDate?: string) {
    const qb = this.attendanceRepository
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.user', 'user')
      .where('att.groupId = :groupId', { groupId });

    if (sessionDate) {
      qb.andWhere('att.sessionDate = :sessionDate', { sessionDate });
    }

    qb.orderBy('att.sessionDate', 'DESC').addOrderBy('user.fullName', 'ASC');

    return qb.getMany();
  }
}
