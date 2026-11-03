import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SermonOutline } from './entities/sermon-outline.entity.js';
import { UserSermonNote } from './entities/user-sermon-note.entity.js';
import { SermonsController } from './sermons.controller.js';
import { SermonsService } from './sermons.service.js';
import { SermonsSeedService } from './sermons-seed.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SermonOutline, UserSermonNote])],
  controllers: [SermonsController],
  providers: [SermonsService, SermonsSeedService],
  exports: [SermonsService],
})
export class SermonsModule {}
