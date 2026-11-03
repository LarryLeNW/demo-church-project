import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationsController } from './donations.controller.js';
import { DonationsSeedService } from './donations-seed.service.js';
import { DonationsService } from './donations.service.js';
import { Donation } from './entities/donation.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Donation])],
  controllers: [DonationsController],
  providers: [DonationsService, DonationsSeedService],
  exports: [DonationsService],
})
export class DonationsModule {}
