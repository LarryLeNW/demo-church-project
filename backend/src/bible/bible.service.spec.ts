import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BibleService } from './bible.service.js';
import { BiblePlan } from './entities/bible-plan.entity.js';
import { DevotionalJournal } from './entities/devotional-journal.entity.js';
import { DevotionalStreak } from './entities/devotional-streak.entity.js';
import { PlanDayReading } from './entities/plan-day-reading.entity.js';
import { UserPlanSubscription } from './entities/user-plan-subscription.entity.js';

describe('BibleService', () => {
  let service: BibleService;
  let planRepo: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let readingRepo: {
    find: ReturnType<typeof vi.fn>;
  };
  let subRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let journalRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let streakRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    planRepo = {
      find: vi.fn(),
      findOne: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    readingRepo = {
      find: vi.fn(),
    };

    subRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((s) => Promise.resolve({ id: 'sub-uuid-1', ...s })),
      findOne: vi.fn(),
      find: vi.fn().mockResolvedValue([]),
    };

    journalRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((j) => Promise.resolve({ id: 'journal-uuid-1', ...j })),
      findOne: vi.fn(),
      find: vi.fn().mockResolvedValue([]),
      remove: vi.fn(),
    };

    streakRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((s) => Promise.resolve({ id: 'streak-uuid-1', ...s })),
      findOne: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibleService,
        { provide: getRepositoryToken(BiblePlan), useValue: planRepo },
        { provide: getRepositoryToken(PlanDayReading), useValue: readingRepo },
        { provide: getRepositoryToken(UserPlanSubscription), useValue: subRepo },
        { provide: getRepositoryToken(DevotionalJournal), useValue: journalRepo },
        { provide: getRepositoryToken(DevotionalStreak), useValue: streakRepo },
      ],
    }).compile();

    service = module.get<BibleService>(BibleService);
  });

  describe('getPlanBySlug', () => {
    it('returns plan when slug matches', async () => {
      planRepo.findOne.mockResolvedValue({
        id: 'p1',
        slug: 'kinh-thanh-tron-nam',
        title: 'Kinh Thánh Trọn Năm',
        readings: [],
      });

      const result = await service.getPlanBySlug('kinh-thanh-tron-nam');
      expect(result.id).toBe('p1');
    });

    it('throws NotFoundException when slug does not exist', async () => {
      planRepo.findOne.mockResolvedValue(null);

      await expect(service.getPlanBySlug('khong-ton-tai')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('subscribePlan', () => {
    it('subscribes user to plan with empty completed days', async () => {
      planRepo.findOne.mockResolvedValue({ id: 'p1', title: 'Plan 1' });
      subRepo.findOne.mockResolvedValue(null);

      const result = await service.subscribePlan('user-1', 'p1');
      expect(result.id).toBe('sub-uuid-1');
      expect(subRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          planId: 'p1',
          completedDays: [],
        }),
      );
    });
  });

  describe('toggleDayCompletion', () => {
    it('adds day to completedDays list when isCompleted is true', async () => {
      subRepo.findOne.mockResolvedValue({
        id: 's1',
        userId: 'u1',
        planId: 'p1',
        completedDays: [1],
        plan: { durationDays: 30 },
      });

      await service.toggleDayCompletion('u1', 'p1', 2, true);
      expect(subRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          completedDays: [1, 2],
          isCompleted: false,
        }),
      );
    });
  });

  describe('createJournal', () => {
    it('creates devotional journal with SOAP fields', async () => {
      const result = await service.createJournal('u1', {
        passage: 'Giăng 15:1-8',
        title: 'Cứ Ở Trong Gốc Nho',
        rhemaWord: 'Ta là gốc nho, các ngươi là nhánh',
        observation: 'Chúa là nguồn sống duy nhất',
        application: 'Tĩnh nguyện mỗi sớm mai',
        prayer: 'Xin giữ lòng con luôn gần Ngài',
      });

      expect(result.id).toBe('journal-uuid-1');
      expect(journalRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          passage: 'Giăng 15:1-8',
          title: 'Cứ Ở Trong Gốc Nho',
          isPrivate: true,
        }),
      );
    });
  });

  describe('recordDevotionalActivity & getMyStreak', () => {
    it('creates initial streak of 1 day for new user', async () => {
      streakRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.recordDevotionalActivity('u1', '2026-03-01');

      expect(streakRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: '2026-03-01',
        }),
      );
      expect(result.id).toBe('streak-uuid-1');
    });

    it('increments streak by 1 on consecutive day and unlocks milestones', async () => {
      streakRepo.findOne.mockResolvedValueOnce({
        id: 'streak-uuid-1',
        userId: 'u1',
        currentStreak: 2,
        longestStreak: 2,
        lastActiveDate: '2026-03-01',
        unlockedMilestones: [],
      });

      await service.recordDevotionalActivity('u1', '2026-03-02');

      expect(streakRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          currentStreak: 3,
          longestStreak: 3,
          lastActiveDate: '2026-03-02',
          unlockedMilestones: expect.arrayContaining(['beginner_3d']),
        }),
      );
    });

    it('resets streak to 1 when a day was missed (>1 day diff)', async () => {
      streakRepo.findOne.mockResolvedValueOnce({
        id: 'streak-uuid-1',
        userId: 'u1',
        currentStreak: 10,
        longestStreak: 10,
        lastActiveDate: '2026-03-01',
        unlockedMilestones: ['beginner_3d', 'planted_by_water_7d'],
      });

      await service.recordDevotionalActivity('u1', '2026-03-05');

      expect(streakRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          currentStreak: 1,
          longestStreak: 10,
          lastActiveDate: '2026-03-05',
          unlockedMilestones: expect.arrayContaining(['beginner_3d', 'planted_by_water_7d']),
        }),
      );
    });

    it('returns empty streak model when user has no streak history', async () => {
      streakRepo.findOne.mockResolvedValueOnce(null);

      const streakData = await service.getMyStreak('u1');
      expect(streakData.currentStreak).toBe(0);
      expect(streakData.isActiveToday).toBe(false);
      expect(streakData.allMilestones.length).toBeGreaterThan(0);
    });
  });
});
