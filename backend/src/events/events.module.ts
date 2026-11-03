import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChurchEvent } from './entities/church-event.entity.js';
import { EventRegistration } from './entities/event-registration.entity.js';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { EventsSeedService } from './events-seed.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ChurchEvent, EventRegistration])],
  controllers: [EventsController],
  providers: [EventsService, EventsSeedService],
  exports: [EventsService],
})
export class EventsModule {}
