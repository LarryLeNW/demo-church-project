import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum.js';
import {
  BaptismStatus,
  SpiritualStage,
} from './enums/pathway.enums.js';
import { PathwayService } from './pathway.service.js';
import { SpiritualProfile } from './entities/spiritual-profile.entity.js';
import { User } from '../users/entities/user.entity.js';

describe('PathwayService', () => {
  let service: PathwayService;
  let profileRepo: any;
  let userRepo: any;

  beforeEach(() => {
    profileRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'profile-uuid-1', createdAt: new Date() })),
      save: vi.fn(async (entity) => ({ ...entity, id: entity.id || 'profile-uuid-1' })),
      createQueryBuilder: vi.fn(),
    };

    userRepo = {
      find: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    service = new PathwayService(profileRepo, userRepo);
  });

  it('creates spiritual profile for member with NEW_BELIEVER stage and initial milestone', async () => {
    profileRepo.findOne.mockResolvedValue(null);

    const user = {
      id: 'user-uuid-1',
      role: Role.Member,
      fullName: 'Tín Hữu Mới',
      campusId: 'Dallas Main Campus',
    };

    const profile = await service.getOrCreateProfile(user);

    expect(profileRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-uuid-1',
        currentStage: SpiritualStage.NEW_BELIEVER,
        baptismStatus: BaptismStatus.NOT_STARTED,
        communionEligible: false,
      }),
    );
    expect(profile.milestoneHistory).toHaveLength(1);
    expect(profile.milestoneHistory[0].stage).toBe(SpiritualStage.NEW_BELIEVER);
  });

  it('creates spiritual profile for SeniorPastor with MINISTRY_LEADER stage and communion eligibility', async () => {
    profileRepo.findOne.mockResolvedValue(null);

    const pastor = {
      id: 'pastor-uuid-1',
      role: Role.SeniorPastor,
      fullName: 'Mục Sư Quản Nhiệm',
      campusId: 'Dallas Main Campus',
    };

    const profile = await service.getOrCreateProfile(pastor);

    expect(profile.currentStage).toBe(SpiritualStage.MINISTRY_LEADER);
    expect(profile.communionEligible).toBe(true);
    expect(profile.baptismStatus).toBe(BaptismStatus.BAPTIZED);
  });

  it('updates personal testimony and enrolls member in baptism class', async () => {
    const existingProfile: Partial<SpiritualProfile> = {
      id: 'profile-1',
      userId: 'user-1',
      currentStage: SpiritualStage.NEW_BELIEVER,
      baptismStatus: BaptismStatus.NOT_STARTED,
      communionEligible: false,
      milestoneHistory: [],
    };
    profileRepo.findOne.mockResolvedValue(existingProfile);

    const updated = await service.updateMyProfile('user-1', {
      salvationDate: '2026-01-01',
      salvationTestimony: 'Chúa đã biến đổi cuộc đời tôi.',
      enrollInBaptismClass: true,
    });

    expect(updated.currentStage).toBe(SpiritualStage.BAPTISM_CANDIDATE);
    expect(updated.baptismStatus).toBe(BaptismStatus.ENROLLED_CLASS);
    expect(updated.salvationTestimony).toBe('Chúa đã biến đổi cuộc đời tôi.');
    expect(updated.milestoneHistory.some((m) => m.stage === SpiritualStage.BAPTISM_CANDIDATE)).toBe(true);
  });

  it('admin verifies baptism, elevates stage to BAPTIZED, and grants communion eligibility', async () => {
    const existingProfile: Partial<SpiritualProfile> = {
      id: 'profile-2',
      userId: 'user-2',
      currentStage: SpiritualStage.BAPTISM_CANDIDATE,
      baptismStatus: BaptismStatus.ENROLLED_CLASS,
      communionEligible: false,
      milestoneHistory: [],
    };
    profileRepo.findOne.mockResolvedValue(existingProfile);

    const result = await service.adminVerifyMilestone(
      'user-2',
      {
        stage: SpiritualStage.BAPTIZED,
        baptismStatus: BaptismStatus.BAPTIZED,
        baptismDate: '2026-04-05',
        baptizedBy: 'Mục Sư David Nguyen',
        pastoralNotes: 'Đã hoàn tất lớp giáo lý và nhận Thánh lễ Báp-têm ngày lễ Phục Sinh.',
      },
      'Mục Sư David Nguyen',
    );

    expect(result.currentStage).toBe(SpiritualStage.BAPTIZED);
    expect(result.communionEligible).toBe(true);
    expect(result.baptismDate).toBe('2026-04-05');
    expect(result.baptizedBy).toBe('Mục Sư David Nguyen');
    expect(result.milestoneHistory).toHaveLength(1);
    expect(result.milestoneHistory[0].verifiedBy).toBe('Mục Sư David Nguyen');
  });

  it('throws NotFoundException when verifying non-existent user profile', async () => {
    profileRepo.findOne.mockResolvedValue(null);

    await expect(
      service.adminVerifyMilestone(
        'unknown-user',
        { stage: SpiritualStage.BAPTIZED },
        'Mục Sư',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('calculates aggregated overview pipeline correctly', async () => {
    const mockProfiles = [
      { currentStage: SpiritualStage.SEEKER, communionEligible: false, baptismStatus: BaptismStatus.NOT_STARTED },
      { currentStage: SpiritualStage.NEW_BELIEVER, communionEligible: false, baptismStatus: BaptismStatus.NOT_STARTED },
      { currentStage: SpiritualStage.BAPTISM_CANDIDATE, communionEligible: false, baptismStatus: BaptismStatus.ENROLLED_CLASS },
      { currentStage: SpiritualStage.BAPTIZED, communionEligible: true, baptismStatus: BaptismStatus.BAPTIZED },
      { currentStage: SpiritualStage.MINISTRY_LEADER, communionEligible: true, baptismStatus: BaptismStatus.BAPTIZED },
    ];

    const getManyMock = vi.fn().mockResolvedValue(mockProfiles);
    profileRepo.createQueryBuilder.mockReturnValue({
      andWhere: vi.fn().mockReturnThis(),
      getMany: getManyMock,
    });

    const stats = await service.adminGetOverview('all');

    expect(stats.total).toBe(5);
    expect(stats.seekerCount).toBe(1);
    expect(stats.newBelieverCount).toBe(1);
    expect(stats.baptismCandidateCount).toBe(1);
    expect(stats.baptizedCount).toBe(1);
    expect(stats.ministryLeaderCount).toBe(1);
    expect(stats.communionEligibleCount).toBe(2);
    expect(stats.inBaptismClassCount).toBe(1);
  });
});
