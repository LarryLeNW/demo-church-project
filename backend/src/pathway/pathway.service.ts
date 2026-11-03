import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import {
  BaptismStatus,
  MilestoneHistoryRecord,
  STAGE_DETAILS,
  SpiritualStage,
} from './enums/pathway.enums.js';
import { SpiritualProfile } from './entities/spiritual-profile.entity.js';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto.js';
import { VerifyMilestoneDto } from './dto/verify-milestone.dto.js';
import { PathwayQueryDto } from './dto/pathway-query.dto.js';

export interface UserSpiritualSummary {
  profile: SpiritualProfile;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: Role;
    avatarUrl: string | null;
    campusId: string | null;
  };
  stageMeta: (typeof STAGE_DETAILS)[SpiritualStage];
}

@Injectable()
export class PathwayService {
  constructor(
    @InjectRepository(SpiritualProfile)
    private readonly profileRepo: Repository<SpiritualProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getOrCreateProfile(user: {
    id: string;
    role?: Role | string;
    fullName?: string;
    campusId?: string | null;
  }): Promise<SpiritualProfile> {
    let profile = await this.profileRepo.findOne({
      where: { userId: user.id },
    });

    if (!profile) {
      const isLeader =
        user.role === Role.SeniorPastor ||
        user.role === Role.Admin ||
        user.role === Role.MinistryLeader;

      const initialStage = isLeader
        ? SpiritualStage.MINISTRY_LEADER
        : SpiritualStage.NEW_BELIEVER;

      const initialMilestones: MilestoneHistoryRecord[] = [
        {
          stage: initialStage,
          title: STAGE_DETAILS[initialStage].titleVi,
          achievedAt: new Date().toISOString(),
          notes: isLeader ? 'Khởi tạo vai trò lãnh đạo mục vụ' : 'Bắt đầu hành trình môn đồ hóa',
          verifiedBy: 'Hội Thánh',
        },
      ];

      profile = this.profileRepo.create({
        userId: user.id,
        currentStage: initialStage,
        baptismStatus: isLeader ? BaptismStatus.BAPTIZED : BaptismStatus.NOT_STARTED,
        communionEligible: isLeader,
        campusId: user.campusId || 'Dallas Main Campus',
        milestoneHistory: initialMilestones,
      });

      profile = await this.profileRepo.save(profile);
    }

    return profile;
  }

  async getMyProfileWithMeta(user: {
    id: string;
    role?: Role | string;
    fullName?: string;
    campusId?: string | null;
  }) {
    const profile = await this.getOrCreateProfile(user);
    const stageMeta = STAGE_DETAILS[profile.currentStage];
    return {
      profile,
      stageMeta,
      allStages: STAGE_DETAILS,
    };
  }

  async updateMyProfile(
    userId: string,
    dto: UpdateMyProfileDto,
  ): Promise<SpiritualProfile> {
    const profile = await this.getOrCreateProfile({ id: userId });

    if (dto.salvationDate !== undefined) {
      profile.salvationDate = dto.salvationDate;
    }
    if (dto.salvationTestimony !== undefined) {
      profile.salvationTestimony = dto.salvationTestimony;
    }
    if (dto.mentorName !== undefined) {
      profile.mentorName = dto.mentorName;
    }
    if (dto.campusId !== undefined) {
      profile.campusId = dto.campusId;
    }

    if (dto.enrollInBaptismClass) {
      if (
        profile.currentStage === SpiritualStage.SEEKER ||
        profile.currentStage === SpiritualStage.NEW_BELIEVER
      ) {
        profile.currentStage = SpiritualStage.BAPTISM_CANDIDATE;
      }
      profile.baptismStatus = BaptismStatus.ENROLLED_CLASS;

      const history = profile.milestoneHistory || [];
      const alreadyHasCandidate = history.some(
        (h) => h.stage === SpiritualStage.BAPTISM_CANDIDATE,
      );
      if (!alreadyHasCandidate) {
        history.push({
          stage: SpiritualStage.BAPTISM_CANDIDATE,
          title: STAGE_DETAILS[SpiritualStage.BAPTISM_CANDIDATE].titleVi,
          achievedAt: new Date().toISOString(),
          notes: 'Đăng ký tham gia lớp giáo lý Báp-têm',
          verifiedBy: 'Tín hữu đăng ký',
        });
        profile.milestoneHistory = history;
      }
    }

    return this.profileRepo.save(profile);
  }

  async adminGetOverview(campusId?: string) {
    const query = this.profileRepo.createQueryBuilder('p');
    if (campusId && campusId !== 'all') {
      query.andWhere('p.campus_id = :campusId', { campusId });
    }

    const profiles = await query.getMany();

    const stats = {
      total: profiles.length,
      seekerCount: 0,
      newBelieverCount: 0,
      baptismCandidateCount: 0,
      baptizedCount: 0,
      discipleCount: 0,
      ministryLeaderCount: 0,
      communionEligibleCount: 0,
      inBaptismClassCount: 0,
      readyForBaptismCount: 0,
    };

    for (const p of profiles) {
      if (p.currentStage === SpiritualStage.SEEKER) stats.seekerCount++;
      if (p.currentStage === SpiritualStage.NEW_BELIEVER) stats.newBelieverCount++;
      if (p.currentStage === SpiritualStage.BAPTISM_CANDIDATE) stats.baptismCandidateCount++;
      if (p.currentStage === SpiritualStage.BAPTIZED) stats.baptizedCount++;
      if (p.currentStage === SpiritualStage.DISCIPLE) stats.discipleCount++;
      if (p.currentStage === SpiritualStage.MINISTRY_LEADER) stats.ministryLeaderCount++;
      if (p.communionEligible) stats.communionEligibleCount++;
      if (p.baptismStatus === BaptismStatus.ENROLLED_CLASS) stats.inBaptismClassCount++;
      if (p.baptismStatus === BaptismStatus.COMPLETED_CLASS) stats.readyForBaptismCount++;
    }

    return stats;
  }

  async adminGetCandidates(query: PathwayQueryDto): Promise<UserSpiritualSummary[]> {
    const qb = this.profileRepo.createQueryBuilder('p');

    if (query.stage) {
      qb.andWhere('p.current_stage = :stage', { stage: query.stage });
    }
    if (query.baptismStatus) {
      qb.andWhere('p.baptism_status = :baptismStatus', {
        baptismStatus: query.baptismStatus,
      });
    }
    if (query.campusId && query.campusId !== 'all') {
      qb.andWhere('p.campus_id = :campusId', { campusId: query.campusId });
    }

    const profiles = await qb.orderBy('p.updated_at', 'DESC').getMany();
    if (profiles.length === 0) return [];

    const userIds = profiles.map((p) => p.userId);
    const users = await this.userRepo
      .createQueryBuilder('u')
      .where('u.id IN (:...userIds)', { userIds })
      .getMany();

    const userMap = new Map(users.map((u) => [u.id, u]));

    const results: UserSpiritualSummary[] = [];

    for (const profile of profiles) {
      const user = userMap.get(profile.userId);
      if (!user) continue;

      if (query.search) {
        const s = query.search.toLowerCase();
        const matchName = user.fullName.toLowerCase().includes(s);
        const matchEmail = user.email.toLowerCase().includes(s);
        const matchPhone = user.phone?.toLowerCase().includes(s);
        if (!matchName && !matchEmail && !matchPhone) continue;
      }

      results.push({
        profile,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl,
          campusId: user.campusId,
        },
        stageMeta: STAGE_DETAILS[profile.currentStage],
      });
    }

    return results;
  }

  async adminVerifyMilestone(
    targetUserId: string,
    dto: VerifyMilestoneDto,
    verifiedByName: string,
  ): Promise<SpiritualProfile> {
    const profile = await this.profileRepo.findOne({
      where: { userId: targetUserId },
    });
    if (!profile) {
      throw new NotFoundException('Không tìm thấy hồ sơ thuộc linh của tín hữu này.');
    }

    profile.currentStage = dto.stage;

    if (dto.baptismStatus !== undefined) {
      profile.baptismStatus = dto.baptismStatus;
    }
    if (dto.baptismClassCompletedAt !== undefined) {
      profile.baptismClassCompletedAt = dto.baptismClassCompletedAt;
    }
    if (dto.baptismDate !== undefined) {
      profile.baptismDate = dto.baptismDate;
    }
    if (dto.baptizedBy !== undefined) {
      profile.baptizedBy = dto.baptizedBy;
    }
    if (dto.communionEligible !== undefined) {
      profile.communionEligible = dto.communionEligible;
    } else if (
      dto.stage === SpiritualStage.BAPTIZED ||
      dto.stage === SpiritualStage.DISCIPLE ||
      dto.stage === SpiritualStage.MINISTRY_LEADER
    ) {
      profile.communionEligible = true;
    }

    if (dto.mentorName !== undefined) {
      profile.mentorName = dto.mentorName;
    }
    if (dto.pastoralNotes !== undefined) {
      profile.pastoralNotes = dto.pastoralNotes;
    }

    const history = profile.milestoneHistory || [];
    history.push({
      stage: dto.stage,
      title: STAGE_DETAILS[dto.stage].titleVi,
      achievedAt: new Date().toISOString(),
      notes: dto.pastoralNotes || `Xác nhận đạt cột mốc ${STAGE_DETAILS[dto.stage].titleVi}`,
      verifiedBy: verifiedByName,
    });
    profile.milestoneHistory = history;

    return this.profileRepo.save(profile);
  }
}
