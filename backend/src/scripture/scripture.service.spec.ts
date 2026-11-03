import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScriptureMemory } from './entities/scripture-memory.entity.js';
import { ScriptureVerse } from './entities/scripture-verse.entity.js';
import {
  BibleTranslation,
  MemoryStatus,
  ScriptureTopic,
} from './enums/scripture.enums.js';
import { ScriptureService } from './scripture.service.js';
import { calculateSM2 } from './utils/sm2.util.js';

describe('ScriptureService & SM-2', () => {
  let service: ScriptureService;
  let verseRepo: {
    find: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let memoryRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    verseRepo = {
      find: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    memoryRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((m) => Promise.resolve({ id: 'memory-uuid-1', ...m })),
      findOne: vi.fn(),
      find: vi.fn().mockResolvedValue([]),
      remove: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScriptureService,
        { provide: getRepositoryToken(ScriptureVerse), useValue: verseRepo },
        { provide: getRepositoryToken(ScriptureMemory), useValue: memoryRepo },
      ],
    }).compile();

    service = module.get<ScriptureService>(ScriptureService);
  });

  describe('calculateSM2 algorithm', () => {
    it('resets repetition and sets 1-day interval on failed recall (rating < 3)', () => {
      const result = calculateSM2({
        rating: 2,
        repetitionCount: 4,
        easeFactor: 2.5,
        intervalDays: 12,
      });

      expect(result.repetitionCount).toBe(0);
      expect(result.intervalDays).toBe(1);
    });

    it('calculates proper 1-day interval on first successful review (repetition = 0)', () => {
      const result = calculateSM2({
        rating: 4,
        repetitionCount: 0,
        easeFactor: 2.5,
        intervalDays: 1,
      });

      expect(result.repetitionCount).toBe(1);
      expect(result.intervalDays).toBe(1);
    });

    it('sets 6-day interval on second successful review (repetition = 1)', () => {
      const result = calculateSM2({
        rating: 5,
        repetitionCount: 1,
        easeFactor: 2.5,
        intervalDays: 1,
      });

      expect(result.repetitionCount).toBe(2);
      expect(result.intervalDays).toBe(6);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });
  });

  describe('addVerseToMemory', () => {
    it('creates verse memory due immediately today', async () => {
      memoryRepo.findOne.mockResolvedValue(null);

      const result = await service.addVerseToMemory('u1', {
        reference: 'John 3:16',
        text: 'For God so loved the world...',
        translation: BibleTranslation.ESV,
        topic: ScriptureTopic.Salvation,
      });

      expect(result.id).toBe('memory-uuid-1');
      expect(memoryRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          reference: 'John 3:16',
          status: MemoryStatus.Learning,
          repetitionCount: 0,
        }),
      );
    });
  });

  describe('reviewVerse', () => {
    it('throws NotFoundException when memory record does not exist', async () => {
      memoryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.reviewVerse('u1', 'non-existent', { rating: 4 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('promotes verse to Mastered when interval >= 14 and repetition >= 4', async () => {
      memoryRepo.findOne.mockResolvedValue({
        id: 'm1',
        userId: 'u1',
        repetitionCount: 3,
        easeFactor: 2.6,
        intervalDays: 6,
        status: MemoryStatus.Learning,
      });

      const result = await service.reviewVerse('u1', 'm1', { rating: 5 });
      expect(result.repetitionCount).toBe(4);
      expect(result.intervalDays).toBeGreaterThanOrEqual(14);
      expect(result.status).toBe(MemoryStatus.Mastered);
    });
  });
});
