import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityRoom } from './entities/facility-room.entity.js';
import { FacilityReservation } from './entities/facility-reservation.entity.js';
import { EquipmentItem } from './entities/equipment-item.entity.js';
import { FacilitiesService } from './facilities.service.js';
import { FacilitiesSeedService } from './facilities-seed.service.js';
import { FacilitiesController } from './facilities.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FacilityRoom,
      FacilityReservation,
      EquipmentItem,
    ]),
  ],
  controllers: [FacilitiesController],
  providers: [FacilitiesService, FacilitiesSeedService],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
