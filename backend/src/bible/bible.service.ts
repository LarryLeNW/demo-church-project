import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiblePlanQueryDto } from './dto/bible-plan-query.dto.js';
import { CreateJournalDto } from './dto/create-journal.dto.js';
import { BiblePlan } from './entities/bible-plan.entity.js';
import { DevotionalJournal } from './entities/devotional-journal.entity.js';
import { DevotionalStreak } from './entities/devotional-streak.entity.js';
import { PlanDayReading } from './entities/plan-day-reading.entity.js';
import { UserPlanSubscription } from './entities/user-plan-subscription.entity.js';
import { SPIRITUAL_MILESTONES } from './enums/milestone.constants.js';

@Injectable()
export class BibleService {
  private readonly logger = new Logger(BibleService.name);

  constructor(
    @InjectRepository(BiblePlan)
    private readonly planRepo: Repository<BiblePlan>,
    @InjectRepository(PlanDayReading)
    private readonly readingRepo: Repository<PlanDayReading>,
    @InjectRepository(UserPlanSubscription)
    private readonly subRepo: Repository<UserPlanSubscription>,
    @InjectRepository(DevotionalJournal)
    private readonly journalRepo: Repository<DevotionalJournal>,
    @InjectRepository(DevotionalStreak)
    private readonly streakRepo: Repository<DevotionalStreak>,
  ) {}

  async getPlans(query: BiblePlanQueryDto) {
    const { category, search } = query;
    const qb = this.planRepo
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.readings', 'reading')
      .where('plan.isPublished = true')
      .orderBy('plan.createdAt', 'ASC');

    if (category) {
      qb.andWhere('plan.category = :category', { category });
    }

    if (search && search.trim()) {
      qb.andWhere(
        '(plan.title LIKE :search OR plan.description LIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    const items = await qb.getMany();
    return items.map((plan) => ({
      ...plan,
      readingsCount: plan.readings?.length || 0,
    }));
  }

  async getPlanBySlug(slug: string) {
    const plan = await this.planRepo.findOne({
      where: { slug },
      relations: { readings: true },
      order: { readings: { dayNumber: 'ASC' } },
    });

    if (!plan) {
      throw new NotFoundException(`Không tìm thấy kế hoạch đọc với mã '${slug}'`);
    }

    return plan;
  }

  async subscribePlan(userId: string, planId: string) {
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException('Không tìm thấy kế hoạch đọc Kinh Thánh.');
    }

    let sub = await this.subRepo.findOne({
      where: { userId, planId },
      relations: { plan: true },
    });

    if (sub) {
      return sub;
    }

    sub = this.subRepo.create({
      userId,
      planId,
      startDate: new Date(),
      completedDays: [],
      isCompleted: false,
      lastReadAt: null,
    });

    return this.subRepo.save(sub);
  }

  async getMySubscriptions(userId: string) {
    const subs = await this.subRepo.find({
      where: { userId },
      relations: { plan: { readings: true } },
      order: { createdAt: 'DESC' },
    });

    return subs.map((sub) => {
      const completedCount = sub.completedDays?.length || 0;
      const totalDays = sub.plan?.durationDays || 1;
      const percentComplete = Math.min(
        100,
        Math.round((completedCount / totalDays) * 100),
      );

      return {
        ...sub,
        completedCount,
        percentComplete,
      };
    });
  }

  async toggleDayCompletion(
    userId: string,
    planId: string,
    dayNumber: number,
    isCompleted: boolean,
  ) {
    let sub = await this.subRepo.findOne({
      where: { userId, planId },
      relations: { plan: true },
    });

    if (!sub) {
      // Auto subscribe if user reads
      sub = await this.subscribePlan(userId, planId);
    }

    const completedSet = new Set<number>(sub.completedDays || []);
    if (isCompleted) {
      completedSet.add(dayNumber);
    } else {
      completedSet.delete(dayNumber);
    }

    sub.completedDays = Array.from(completedSet).sort((a, b) => a - b);
    sub.lastReadAt = new Date();

    if (sub.plan && sub.completedDays.length >= sub.plan.durationDays) {
      sub.isCompleted = true;
    } else {
      sub.isCompleted = false;
    }

    const savedSub = await this.subRepo.save(sub);

    // If day was completed, update devotional streak
    if (isCompleted) {
      try {
        await this.recordDevotionalActivity(userId);
      } catch (err) {
        this.logger.warn(`Không thể cập nhật streak cho user ${userId}: ${(err as Error).message}`);
      }
    }

    return savedSub;
  }

  async getMyJournals(userId: string) {
    return this.journalRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getJournalById(userId: string, id: string) {
    const journal = await this.journalRepo.findOne({ where: { id, userId } });
    if (!journal) {
      throw new NotFoundException('Không tìm thấy nhật ký tĩnh nguyện.');
    }
    return journal;
  }

  async createJournal(userId: string, dto: CreateJournalDto) {
    const journal = this.journalRepo.create({
      userId,
      planId: dto.planId || null,
      dayNumber: dto.dayNumber || null,
      passage: dto.passage.trim(),
      title: dto.title.trim(),
      rhemaWord: dto.rhemaWord.trim(),
      observation: dto.observation.trim(),
      application: dto.application.trim(),
      prayer: dto.prayer.trim(),
      isPrivate: dto.isPrivate ?? true,
    });

    const savedJournal = await this.journalRepo.save(journal);

    // Recording a SOAP journal counts towards the daily devotional streak
    try {
      await this.recordDevotionalActivity(userId);
    } catch (err) {
      this.logger.warn(`Không thể cập nhật streak khi viết journal cho user ${userId}: ${(err as Error).message}`);
    }

    return savedJournal;
  }

  async deleteJournal(userId: string, id: string) {
    const journal = await this.getJournalById(userId, id);
    await this.journalRepo.remove(journal);
    return { success: true };
  }

  async recordDevotionalActivity(userId: string, inputDateStr?: string) {
    const todayStr = inputDateStr || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    let streak = await this.streakRepo.findOne({ where: { userId } });

    if (!streak) {
      // Create first streak record
      const unlocked: string[] = [];
      for (const m of SPIRITUAL_MILESTONES) {
        if (1 >= m.requiredDays) {
          unlocked.push(m.id);
        }
      }

      streak = this.streakRepo.create({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: todayStr,
        unlockedMilestones: unlocked,
      });

      return this.streakRepo.save(streak);
    }

    // If already active today, check milestones and return
    if (streak.lastActiveDate === todayStr) {
      this.evaluateMilestones(streak);
      return this.streakRepo.save(streak);
    }

    // Calculate calendar days difference
    const lastDate = new Date(`${streak.lastActiveDate}T00:00:00Z`);
    const currentDate = new Date(`${todayStr}T00:00:00Z`);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Consecutive day streak continues
      streak.currentStreak += 1;
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      streak.currentStreak = 1;
    }
    // If diffDays < 0 (earlier date entered), keep current streak

    streak.lastActiveDate = todayStr;
    this.evaluateMilestones(streak);

    return this.streakRepo.save(streak);
  }

  private evaluateMilestones(streak: DevotionalStreak) {
    const unlockedSet = new Set<string>(streak.unlockedMilestones || []);
    for (const milestone of SPIRITUAL_MILESTONES) {
      if (streak.currentStreak >= milestone.requiredDays || streak.longestStreak >= milestone.requiredDays) {
        unlockedSet.add(milestone.id);
      }
    }
    streak.unlockedMilestones = Array.from(unlockedSet);
  }

  async getMyStreak(userId: string) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const streak = await this.streakRepo.findOne({ where: { userId } });

    if (!streak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        isActiveToday: false,
        unlockedMilestones: [],
        allMilestones: SPIRITUAL_MILESTONES.map((m) => ({
          ...m,
          isUnlocked: false,
        })),
      };
    }

    // Check if streak was broken yesterday
    const lastDate = new Date(`${streak.lastActiveDate}T00:00:00Z`);
    const currentDate = new Date(`${todayStr}T00:00:00Z`);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    const isActiveToday = streak.lastActiveDate === todayStr;
    // If diffDays > 1, the streak has elapsed unless they act today
    const effectiveStreak = diffDays > 1 && !isActiveToday ? 0 : streak.currentStreak;

    return {
      id: streak.id,
      userId: streak.userId,
      currentStreak: effectiveStreak,
      longestStreak: streak.longestStreak,
      lastActiveDate: streak.lastActiveDate,
      isActiveToday,
      unlockedMilestones: streak.unlockedMilestones || [],
      allMilestones: SPIRITUAL_MILESTONES.map((m) => ({
        ...m,
        isUnlocked: streak.unlockedMilestones?.includes(m.id) || false,
      })),
    };
  }

}
