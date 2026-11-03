import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { SpiritualProfile } from './entities/spiritual-profile.entity.js';
import { PathwayController } from './pathway.controller.js';
import { PathwayService } from './pathway.service.js';
import { PathwaySeedService } from './pathway-seed.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SpiritualProfile, User])],
  controllers: [PathwayController],
  providers: [PathwayService, PathwaySeedService],
  exports: [PathwayService],
})
export class PathwayModule {}
