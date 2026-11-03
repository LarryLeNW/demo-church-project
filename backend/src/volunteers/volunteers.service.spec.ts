import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  BackgroundCheckStatus,
  RosterStatus,
  VolunteerStatus,
} from './enums/volunteer.enums.js';
import { VolunteersService } from './volunteers.service.js';

describe('VolunteersService', () => {
  let service: VolunteersService;
  let teamRepo: any;
  let memberRepo: any;
  let rosterRepo: any;
  let userRepo: any;

  beforeEach(() => {
    teamRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'team-1', createdAt: new Date() })),
      save: vi.fn(async (entity) => ({ ...entity, id: entity.id || 'team-1' })),
      createQueryBuilder: vi.fn(),
    };

    memberRepo = {
      findOne: vi.fn(),
      count: vi.fn().mockResolvedValue(5),
      create: vi.fn((dto) => ({ ...dto, id: 'member-1' })),
      save: vi.fn(async (entity) => ({ ...entity, id: entity.id || 'member-1' })),
    };

    rosterRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'roster-1' })),
      save: vi.fn(async (entity) => ({ ...entity, id: entity.id || 'roster-1' })),
      remove: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn(),
    };

    userRepo = {
      findOne: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    service = new VolunteersService(teamRepo, memberRepo, rosterRepo, userRepo);
  });

  it('creates ministry team with required parameters', async () => {
    const created = await service.createTeam({
      name: 'Ban Thờ Phượng',
      nameEn: 'Worship Team',
      campusId: 'Dallas Main Campus',
      requiredClearance: false,
    });

    expect(teamRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ban Thờ Phượng',
        nameEn: 'Worship Team',
        campusId: 'Dallas Main Campus',
      }),
    );
    expect(created.id).toBe('team-1');
  });

  it('allows a member to join a ministry team', async () => {
    teamRepo.findOne.mockResolvedValue({ id: 'team-1', name: 'Ban Thờ Phượng', requiredClearance: false });
    memberRepo.findOne.mockResolvedValue(null);

    const member = await service.joinTeam('user-1', {
      teamId: 'team-1',
      roleInTeam: 'Pianist',
    });

    expect(memberRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: 'team-1',
        userId: 'user-1',
        roleInTeam: 'Pianist',
        status: VolunteerStatus.ACTIVE,
      }),
    );
    expect(member.id).toBe('member-1');
  });

  it('throws BadRequestException if member is already active in the team', async () => {
    teamRepo.findOne.mockResolvedValue({ id: 'team-1' });
    memberRepo.findOne.mockResolvedValue({
      id: 'member-1',
      status: VolunteerStatus.ACTIVE,
    });

    await expect(
      service.joinTeam('user-1', { teamId: 'team-1' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('assigns a volunteer to a Sunday service roster slot', async () => {
    teamRepo.findOne.mockResolvedValue({ id: 'team-1' });
    userRepo.findOne.mockResolvedValue({ id: 'user-1', fullName: 'David Tran' });

    const roster = await service.assignRoster({
      serviceDate: '2026-11-08',
      serviceTitle: 'Lễ Thờ Phượng Chúa Nhật',
      campusId: 'Dallas Main Campus',
      teamId: 'team-1',
      userId: 'user-1',
      roleTitle: 'Hát Chính',
    });

    expect(rosterRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceDate: '2026-11-08',
        campusId: 'Dallas Main Campus',
        roleTitle: 'Hát Chính',
        status: RosterStatus.PENDING,
      }),
    );
    expect(roster.id).toBe('roster-1');
  });

  it('allows volunteer to confirm their assigned roster slot', async () => {
    rosterRepo.findOne.mockResolvedValue({
      id: 'roster-1',
      userId: 'user-1',
      status: RosterStatus.PENDING,
    });

    const updated = await service.updateMyRosterStatus('roster-1', 'user-1', {
      status: RosterStatus.CONFIRMED,
    });

    expect(updated.status).toBe(RosterStatus.CONFIRMED);
    expect(rosterRepo.save).toHaveBeenCalled();
  });

  it('prevents another user from updating someone else roster slot', async () => {
    rosterRepo.findOne.mockResolvedValue({
      id: 'roster-1',
      userId: 'user-original',
      status: RosterStatus.PENDING,
    });

    await expect(
      service.updateMyRosterStatus('roster-1', 'user-attacker', {
        status: RosterStatus.CONFIRMED,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('records reason when a volunteer declines roster slot', async () => {
    rosterRepo.findOne.mockResolvedValue({
      id: 'roster-1',
      userId: 'user-1',
      status: RosterStatus.PENDING,
    });

    const updated = await service.updateMyRosterStatus('roster-1', 'user-1', {
      status: RosterStatus.DECLINED,
      declineReason: 'Bận công tác đột xuất tại Houston',
    });

    expect(updated.status).toBe(RosterStatus.DECLINED);
    expect(updated.declineReason).toBe('Bận công tác đột xuất tại Houston');
  });

  it('calculates Sunday roster overview stats with confirmation rate', async () => {
    const mockRosters = [
      { id: 'r1', teamId: 't1', userId: 'u1', status: RosterStatus.CONFIRMED },
      { id: 'r2', teamId: 't1', userId: 'u2', status: RosterStatus.CONFIRMED },
      { id: 'r3', teamId: 't2', userId: 'u3', status: RosterStatus.PENDING },
      { id: 'r4', teamId: 't2', userId: 'u4', status: RosterStatus.DECLINED },
    ];

    rosterRepo.createQueryBuilder.mockReturnValue({
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue(mockRosters),
    });

    teamRepo.createQueryBuilder.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([{ id: 't1', name: 'Worship' }, { id: 't2', name: 'Media' }]),
    });

    userRepo.createQueryBuilder.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([
        { id: 'u1', fullName: 'User 1' },
        { id: 'u2', fullName: 'User 2' },
        { id: 'u3', fullName: 'User 3' },
        { id: 'u4', fullName: 'User 4' },
      ]),
    });

    const result = await service.getRosterOverview({ serviceDate: '2026-11-08' });

    expect(result.stats.total).toBe(4);
    expect(result.stats.confirmed).toBe(2);
    expect(result.stats.pending).toBe(1);
    expect(result.stats.declined).toBe(1);
    expect(result.stats.confirmationRate).toBe(50); // 2/4 = 50%
  });
});
