import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiblePlan } from './entities/bible-plan.entity.js';
import { DevotionalJournal } from './entities/devotional-journal.entity.js';
import { DevotionalStreak } from './entities/devotional-streak.entity.js';
import { PlanDayReading } from './entities/plan-day-reading.entity.js';
import { UserPlanSubscription } from './entities/user-plan-subscription.entity.js';
import { BibleController } from './bible.controller.js';
import { BibleSeedService } from './bible-seed.service.js';
import { BibleService } from './bible.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BiblePlan,
      PlanDayReading,
      UserPlanSubscription,
      DevotionalJournal,
      DevotionalStreak,
    ]),
  ],
  controllers: [BibleController],
  providers: [BibleService, BibleSeedService],
  exports: [BibleService],
})
export class BibleModule {}

