import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupAttendance } from '../groups/entities/group-attendance.entity.js';
import { User } from '../users/entities/user.entity.js';
import { PastoralVisitLog } from './entities/pastoral-visit-log.entity.js';
import { PrayerIntercession } from './entities/prayer-intercession.entity.js';
import { PrayerRequest } from './entities/prayer-request.entity.js';
import { PrayersController } from './prayers.controller.js';
import { PrayersSeedService } from './prayers-seed.service.js';
import { PrayersService } from './prayers.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrayerRequest,
      PrayerIntercession,
      PastoralVisitLog,
      User,
      GroupAttendance,
    ]),
  ],
  controllers: [PrayersController],
  providers: [PrayersService, PrayersSeedService],
  exports: [PrayersService],
})
export class PrayersModule {}
