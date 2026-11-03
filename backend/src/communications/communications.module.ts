import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { ChurchBulletin } from './entities/church-bulletin.entity.js';
import { ChurchCommunication } from './entities/church-communication.entity.js';
import { CommunicationsController } from './communications.controller.js';
import { CommunicationsSeedService } from './communications-seed.service.js';
import { CommunicationsService } from './communications.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChurchCommunication, ChurchBulletin, User]),
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, CommunicationsSeedService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
