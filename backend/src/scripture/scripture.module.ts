import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibleModule } from '../bible/bible.module.js';
import { ScriptureMemory } from './entities/scripture-memory.entity.js';
import { ScriptureVerse } from './entities/scripture-verse.entity.js';
import { ScriptureController } from './scripture.controller.js';
import { ScriptureSeedService } from './scripture-seed.service.js';
import { ScriptureService } from './scripture.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScriptureVerse, ScriptureMemory]),
    BibleModule,
  ],
  controllers: [ScriptureController],
  providers: [ScriptureService, ScriptureSeedService],
  exports: [ScriptureService],
})
export class ScriptureModule {}

