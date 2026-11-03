import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { MinistryTeam } from './entities/ministry-team.entity.js';
import { VolunteerMember } from './entities/volunteer-member.entity.js';
import { SundayRoster } from './entities/sunday-roster.entity.js';
import { VolunteersController } from './volunteers.controller.js';
import { VolunteersService } from './volunteers.service.js';
import { VolunteersSeedService } from './volunteers-seed.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MinistryTeam,
      VolunteerMember,
      SundayRoster,
      User,
    ]),
  ],
  controllers: [VolunteersController],
  providers: [VolunteersService, VolunteersSeedService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
