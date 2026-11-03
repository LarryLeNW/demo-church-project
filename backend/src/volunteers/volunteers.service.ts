import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import {
  BackgroundCheckStatus,
  RosterStatus,
  VolunteerStatus,
} from './enums/volunteer.enums.js';
import { MinistryTeam } from './entities/ministry-team.entity.js';
import { VolunteerMember } from './entities/volunteer-member.entity.js';
import { SundayRoster } from './entities/sunday-roster.entity.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { AssignRosterDto } from './dto/assign-roster.dto.js';
import { UpdateRosterStatusDto } from './dto/update-roster-status.dto.js';
import { JoinTeamDto } from './dto/join-team.dto.js';
import { RosterQueryDto } from './dto/roster-query.dto.js';

export interface RosterDetail {
  roster: SundayRoster;
  team: MinistryTeam;
  volunteer: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
}

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(MinistryTeam)
    private readonly teamRepo: Repository<MinistryTeam>,
    @InjectRepository(VolunteerMember)
    private readonly memberRepo: Repository<VolunteerMember>,
    @InjectRepository(SundayRoster)
    private readonly rosterRepo: Repository<SundayRoster>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getTeams(campusId?: string) {
    const qb = this.teamRepo.createQueryBuilder('t').where('t.is_active = :isActive', { isActive: true });
    if (campusId && campusId !== 'all') {
      qb.andWhere('t.campus_id = :campusId', { campusId });
    }
    const teams = await qb.orderBy('t.name', 'ASC').getMany();

    const results = [];
    for (const team of teams) {
      const memberCount = await this.memberRepo.count({
        where: { teamId: team.id, status: VolunteerStatus.ACTIVE },
      });
      let leaderName: string | null = null;
      if (team.leaderId) {
        const leader = await this.userRepo.findOne({ where: { id: team.leaderId } });
        if (leader) leaderName = leader.fullName;
      }
      results.push({
        ...team,
        memberCount,
        leaderName,
      });
    }
    return results;
  }

  async createTeam(dto: CreateTeamDto): Promise<MinistryTeam> {
    const team = this.teamRepo.create({
      name: dto.name,
      nameEn: dto.nameEn,
      leaderId: dto.leaderId || null,
      campusId: dto.campusId || 'Dallas Main Campus',
      description: dto.description || null,
      requiredClearance: dto.requiredClearance ?? false,
      color: dto.color || 'indigo',
      iconName: dto.iconName || 'Users',
    });
    return this.teamRepo.save(team);
  }

  async joinTeam(userId: string, dto: JoinTeamDto): Promise<VolunteerMember> {
    const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
    if (!team) {
      throw new NotFoundException('Không tìm thấy ban mục vụ này.');
    }

    let member = await this.memberRepo.findOne({
      where: { teamId: dto.teamId, userId },
    });

    if (member) {
      if (member.status === VolunteerStatus.ACTIVE) {
        throw new BadRequestException('Bạn đã là thành viên chính thức của ban mục vụ này.');
      }
      member.status = VolunteerStatus.ACTIVE;
      member.roleInTeam = dto.roleInTeam || member.roleInTeam;
      return this.memberRepo.save(member);
    }

    member = this.memberRepo.create({
      teamId: dto.teamId,
      userId,
      roleInTeam: dto.roleInTeam || 'Thành viên phụng sự',
      status: VolunteerStatus.ACTIVE,
      backgroundCheckStatus: team.requiredClearance
        ? BackgroundCheckStatus.PENDING
        : BackgroundCheckStatus.NOT_REQUIRED,
      notes: dto.notes || null,
    });

    return this.memberRepo.save(member);
  }

  async getMySchedule(userId: string): Promise<RosterDetail[]> {
    const rosters = await this.rosterRepo
      .createQueryBuilder('r')
      .where('r.user_id = :userId', { userId })
      .orderBy('r.service_date', 'DESC')
      .getMany();

    if (rosters.length === 0) return [];

    const teamIds = [...new Set(rosters.map((r) => r.teamId))];
    const teams = await this.teamRepo
      .createQueryBuilder('t')
      .where('t.id IN (:...teamIds)', { teamIds })
      .getMany();
    const teamMap = new Map(teams.map((t) => [t.id, t]));

    const user = await this.userRepo.findOne({ where: { id: userId } });

    return rosters.map((roster) => ({
      roster,
      team: teamMap.get(roster.teamId) || ({} as MinistryTeam),
      volunteer: {
        id: user?.id || userId,
        fullName: user?.fullName || 'Tín Hữu',
        email: user?.email || '',
        phone: user?.phone || null,
      },
    }));
  }

  async updateMyRosterStatus(
    rosterId: string,
    userId: string,
    dto: UpdateRosterStatusDto,
  ): Promise<SundayRoster> {
    const roster = await this.rosterRepo.findOne({ where: { id: rosterId } });
    if (!roster) {
      throw new NotFoundException('Không tìm thấy ca trực phụng sự này.');
    }

    if (roster.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật trạng thái ca trực của chính mình.');
    }

    roster.status = dto.status;
    if (dto.declineReason) {
      roster.declineReason = dto.declineReason;
    }
    if (dto.swapTargetUserId) {
      roster.swapTargetUserId = dto.swapTargetUserId;
    }
    if (dto.swapNotes) {
      roster.swapNotes = dto.swapNotes;
    }

    return this.rosterRepo.save(roster);
  }

  async assignRoster(dto: AssignRosterDto): Promise<SundayRoster> {
    const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
    if (!team) {
      throw new NotFoundException('Không tìm thấy ban mục vụ.');
    }

    const volunteer = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!volunteer) {
      throw new NotFoundException('Không tìm thấy tín hữu được phân công.');
    }

    const roster = this.rosterRepo.create({
      serviceDate: dto.serviceDate,
      serviceTitle: dto.serviceTitle || 'Lễ Thờ Phượng Chúa Nhật',
      campusId: dto.campusId,
      teamId: dto.teamId,
      userId: dto.userId,
      roleTitle: dto.roleTitle,
      status: RosterStatus.PENDING,
      notes: dto.notes || null,
    });

    return this.rosterRepo.save(roster);
  }

  async removeRoster(rosterId: string): Promise<{ success: boolean }> {
    const roster = await this.rosterRepo.findOne({ where: { id: rosterId } });
    if (!roster) {
      throw new NotFoundException('Không tìm thấy ca trực.');
    }
    await this.rosterRepo.remove(roster);
    return { success: true };
  }

  async getRosterOverview(query: RosterQueryDto) {
    const qb = this.rosterRepo.createQueryBuilder('r');

    if (query.serviceDate) {
      qb.andWhere('r.service_date = :serviceDate', { serviceDate: query.serviceDate });
    }
    if (query.campusId && query.campusId !== 'all') {
      qb.andWhere('r.campus_id = :campusId', { campusId: query.campusId });
    }
    if (query.teamId) {
      qb.andWhere('r.team_id = :teamId', { teamId: query.teamId });
    }
    if (query.status) {
      qb.andWhere('r.status = :status', { status: query.status });
    }

    const rosters = await qb.orderBy('r.service_date', 'ASC').getMany();

    if (rosters.length === 0) {
      return {
        stats: { total: 0, confirmed: 0, pending: 0, declined: 0, confirmationRate: 0 },
        items: [],
      };
    }

    const teamIds = [...new Set(rosters.map((r) => r.teamId))];
    const userIds = [...new Set(rosters.map((r) => r.userId))];

    const [teams, users] = await Promise.all([
      this.teamRepo.createQueryBuilder('t').where('t.id IN (:...teamIds)', { teamIds }).getMany(),
      this.userRepo.createQueryBuilder('u').where('u.id IN (:...userIds)', { userIds }).getMany(),
    ]);

    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const userMap = new Map(users.map((u) => [u.id, u]));

    let confirmedCount = 0;
    let pendingCount = 0;
    let declinedCount = 0;

    const items: RosterDetail[] = rosters.map((roster) => {
      if (roster.status === RosterStatus.CONFIRMED) confirmedCount++;
      if (roster.status === RosterStatus.PENDING) pendingCount++;
      if (roster.status === RosterStatus.DECLINED) declinedCount++;

      const u = userMap.get(roster.userId);
      return {
        roster,
        team: teamMap.get(roster.teamId) || ({} as MinistryTeam),
        volunteer: {
          id: u?.id || roster.userId,
          fullName: u?.fullName || 'Tín Hữu',
          email: u?.email || '',
          phone: u?.phone || null,
        },
      };
    });

    const total = rosters.length;
    const confirmationRate = total > 0 ? Math.round((confirmedCount / total) * 100) : 0;

    return {
      stats: {
        total,
        confirmed: confirmedCount,
        pending: pendingCount,
        declined: declinedCount,
        confirmationRate,
      },
      items,
    };
  }

  async updateClearance(volunteerMemberId: string, status: BackgroundCheckStatus) {
    const member = await this.memberRepo.findOne({ where: { id: volunteerMemberId } });
    if (!member) {
      throw new NotFoundException('Không tìm thấy hồ sơ tình nguyện viên.');
    }
    member.backgroundCheckStatus = status;
    if (status === BackgroundCheckStatus.APPROVED) {
      member.backgroundCheckApprovedAt = new Date().toISOString().split('T')[0];
    }
    return this.memberRepo.save(member);
  }
}
