import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Household } from './entities/household.entity.js';
import { PastoralCareRequest } from './entities/pastoral-care-request.entity.js';
import { PastoralController } from './pastoral.controller.js';
import { PastoralService } from './pastoral.service.js';
import { PastoralSeedService } from './pastoral-seed.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Household,
      PastoralCareRequest,
      User,
    ]),
  ],
  controllers: [PastoralController],
  providers: [PastoralService, PastoralSeedService],
  exports: [PastoralService],
})
export class PastoralModule {}
