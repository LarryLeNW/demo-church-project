import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller.js';
import { CoursesSeedService } from './courses-seed.service.js';
import { CoursesService } from './courses.service.js';
import { Course } from './entities/course.entity.js';
import { LessonProgress } from './entities/lesson-progress.entity.js';
import { Lesson } from './entities/lesson.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Lesson, LessonProgress])],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesSeedService],
  exports: [CoursesService],
})
export class CoursesModule {}
