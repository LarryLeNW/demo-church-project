import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallGroup } from './entities/small-group.entity.js';
import { GroupMember } from './entities/group-member.entity.js';
import { GroupAttendance } from './entities/group-attendance.entity.js';
import { User } from '../users/entities/user.entity.js';
import { GroupsService } from './groups.service.js';
import { GroupsController } from './groups.controller.js';
import { GroupsSeedService } from './groups-seed.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SmallGroup, GroupMember, GroupAttendance, User])],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsSeedService],
  exports: [GroupsService],
})
export class GroupsModule {}
