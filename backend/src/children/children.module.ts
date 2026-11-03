import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { ChildCheckin } from './entities/child-checkin.entity.js';
import { ChildProfile } from './entities/child-profile.entity.js';
import { ChildrenController } from './children.controller.js';
import { ChildrenSeedService } from './children-seed.service.js';
import { ChildrenService } from './children.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ChildProfile, ChildCheckin, User])],
  controllers: [ChildrenController],
  providers: [ChildrenService, ChildrenSeedService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
