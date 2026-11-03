import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { SpiritualProfile } from '../pathway/entities/spiritual-profile.entity.js';
import { SmallGroup } from '../groups/entities/small-group.entity.js';
import { GroupAttendance } from '../groups/entities/group-attendance.entity.js';
import { Donation } from '../donations/entities/donation.entity.js';
import { PastoralCareRequest } from '../pastoral/entities/pastoral-care-request.entity.js';
import { SundayRoster } from '../volunteers/entities/sunday-roster.entity.js';
import { Household } from '../pastoral/entities/household.entity.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SpiritualProfile,
      SmallGroup,
      GroupAttendance,
      Donation,
      PastoralCareRequest,
      SundayRoster,
      Household,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
