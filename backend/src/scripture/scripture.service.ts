import {
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibleService } from '../bible/bible.service.js';
import { AddMemoryVerseDto } from './dto/add-memory-verse.dto.js';
import { ReviewVerseDto } from './dto/review-verse.dto.js';
import { ScriptureQueryDto } from './dto/scripture-query.dto.js';
import { ScriptureMemory } from './entities/scripture-memory.entity.js';
import { ScriptureVerse } from './entities/scripture-verse.entity.js';
import {
  BibleTranslation,
  MemoryStatus,
  ScriptureTopic,
} from './enums/scripture.enums.js';
import { calculateSM2 } from './utils/sm2.util.js';

@Injectable()
export class ScriptureService {
  private readonly logger = new Logger(ScriptureService.name);

  constructor(
    @InjectRepository(ScriptureVerse)
    private readonly verseRepo: Repository<ScriptureVerse>,
    @InjectRepository(ScriptureMemory)
    private readonly memoryRepo: Repository<ScriptureMemory>,
    @Optional()
    private readonly bibleService?: BibleService,
  ) {}

  async getVerseLibrary(topic?: ScriptureTopic) {
    const qb = this.verseRepo.createQueryBuilder('verse');
    if (topic) {
      qb.where('verse.topic = :topic', { topic });
    }
    qb.orderBy('verse.orderIndex', 'ASC').addOrderBy('verse.reference', 'ASC');
    return qb.getMany();
  }

  async getMyMemories(userId: string, query: ScriptureQueryDto) {
    const { page = 1, limit = 30, dueOnly, topic, status, translation } = query;
    const skip = (page - 1) * limit;
    const now = new Date();

    const qb = this.memoryRepo
      .createQueryBuilder('memory')
      .where('memory.userId = :userId', { userId })
      .orderBy('memory.nextReviewDate', 'ASC');

    if (dueOnly) {
      qb.andWhere('memory.nextReviewDate <= :now', { now });
    }

    if (topic) {
      qb.andWhere('memory.topic = :topic', { topic });
    }

    if (status) {
      qb.andWhere('memory.status = :status', { status });
    }

    if (translation) {
      qb.andWhere('memory.translation = :translation', { translation });
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    // Summary statistics for dashboard badges
    const allUserMemories = await this.memoryRepo.find({ where: { userId } });
    const dueTodayCount = allUserMemories.filter(
      (m) => new Date(m.nextReviewDate) <= now,
    ).length;
    const masteredCount = allUserMemories.filter(
      (m) => m.status === MemoryStatus.Mastered,
    ).length;
    const learningCount = allUserMemories.filter(
      (m) => m.status === MemoryStatus.Learning,
    ).length;

    return {
      items,
      total,
      stats: {
        totalVerses: allUserMemories.length,
        dueTodayCount,
        masteredCount,
        learningCount,
      },
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async addVerseToMemory(userId: string, dto: AddMemoryVerseDto) {
    const existing = await this.memoryRepo.findOne({
      where: { userId, reference: dto.reference.trim() },
    });

    if (existing) {
      return existing;
    }

    // Due immediately today so user can practice right away
    const today = new Date();

    const memory = this.memoryRepo.create({
      userId,
      verseId: dto.verseId || null,
      reference: dto.reference.trim(),
      text: dto.text.trim(),
      translation: dto.translation || BibleTranslation.RVV11,
      topic: dto.topic || ScriptureTopic.Salvation,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitionCount: 0,
      nextReviewDate: today,
      status: MemoryStatus.Learning,
    });

    return this.memoryRepo.save(memory);
  }

  async reviewVerse(userId: string, memoryId: string, dto: ReviewVerseDto) {
    const memory = await this.memoryRepo.findOne({
      where: { id: memoryId, userId },
    });

    if (!memory) {
      throw new NotFoundException('Không tìm thấy câu gốc cần ôn tập.');
    }

    const sm2Result = calculateSM2({
      rating: dto.rating,
      repetitionCount: memory.repetitionCount,
      easeFactor: memory.easeFactor,
      intervalDays: memory.intervalDays,
    });

    memory.repetitionCount = sm2Result.repetitionCount;
    memory.easeFactor = sm2Result.easeFactor;
    memory.intervalDays = sm2Result.intervalDays;
    memory.nextReviewDate = sm2Result.nextReviewDate;
    memory.lastReviewedAt = new Date();

    // Mark as mastered if reviewed successfully at least 4 times with interval >= 14 days
    if (memory.repetitionCount >= 4 && memory.intervalDays >= 14) {
      memory.status = MemoryStatus.Mastered;
    } else {
      memory.status = MemoryStatus.Learning;
    }

    const savedMemory = await this.memoryRepo.save(memory);

    // Reviewing Scripture contributes to Devotional Streak
    if (this.bibleService) {
      try {
        await this.bibleService.recordDevotionalActivity(userId);
      } catch (err) {
        this.logger.warn(`Không thể cập nhật streak cho user ${userId}: ${(err as Error).message}`);
      }
    }

    return savedMemory;
  }

  async removeVerse(userId: string, memoryId: string) {
    const memory = await this.memoryRepo.findOne({
      where: { id: memoryId, userId },
    });

    if (!memory) {
      throw new NotFoundException('Không tìm thấy câu gốc.');
    }

    await this.memoryRepo.remove(memory);
    return { success: true };
  }
}
