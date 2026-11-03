import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CourseQueryDto } from './dto/course-query.dto.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { SaveLessonProgressDto } from './dto/lesson-progress.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { Course } from './entities/course.entity.js';
import { LessonProgress } from './entities/lesson-progress.entity.js';
import { Lesson } from './entities/lesson.entity.js';

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(LessonProgress)
    private readonly progressRepo: Repository<LessonProgress>,
  ) {}

  async findAll(query: CourseQueryDto) {
    const { page = 1, limit = 20, search, category, language } = query;
    const skip = (page - 1) * limit;

    const qb = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.lessons', 'lesson')
      .orderBy('course.orderIndex', 'ASC')
      .addOrderBy('course.createdAt', 'DESC')
      .addOrderBy('lesson.orderIndex', 'ASC');

    if (category) {
      qb.andWhere('course.category = :category', { category });
    }

    if (language) {
      qb.andWhere('course.language = :language', { language });
    }

    if (search && search.trim()) {
      qb.andWhere(
        '(course.title LIKE :search OR course.description LIKE :search OR course.instructorName LIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    // Map lessons count and total duration
    const enrichedItems = items.map((course) => {
      const lessons = course.lessons || [];
      const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
      return {
        ...course,
        lessonsCount: lessons.length,
        totalDuration,
      };
    });

    return {
      items: enrichedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: { lessons: true },
      order: {
        lessons: {
          orderIndex: 'ASC',
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với đường dẫn '${slug}'`);
    }

    return course;
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: { lessons: true },
      order: {
        lessons: {
          orderIndex: 'ASC',
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID '${id}'`);
    }

    return course;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    let slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.title);
    if (!slug) {
      slug = `khoa-hoc-${Date.now()}`;
    }

    // Check duplicate slug
    const existing = await this.courseRepo.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const course = this.courseRepo.create({
      ...dto,
      slug,
    });

    return this.courseRepo.save(course);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);

    if (dto.slug && dto.slug !== course.slug) {
      const formattedSlug = slugify(dto.slug);
      const existing = await this.courseRepo.findOne({ where: { slug: formattedSlug } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Slug '${formattedSlug}' đã tồn tại.`);
      }
      dto.slug = formattedSlug;
    }

    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const course = await this.findById(id);
    await this.courseRepo.remove(course);
    return { success: true };
  }

  async addLesson(courseId: string, dto: CreateLessonDto): Promise<Lesson> {
    const course = await this.findById(courseId);

    let slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.title);
    if (!slug) {
      slug = `bai-hoc-${Date.now()}`;
    }

    const lesson = this.lessonRepo.create({
      ...dto,
      courseId: course.id,
      slug,
    });

    return this.lessonRepo.save(lesson);
  }

  async updateLesson(lessonId: string, dto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy bài học với ID '${lessonId}'`);
    }

    if (dto.slug && dto.slug !== lesson.slug) {
      dto.slug = slugify(dto.slug);
    }

    Object.assign(lesson, dto);
    return this.lessonRepo.save(lesson);
  }

  async deleteLesson(lessonId: string): Promise<{ success: boolean }> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy bài học với ID '${lessonId}'`);
    }

    await this.lessonRepo.remove(lesson);
    return { success: true };
  }

  async saveLessonProgress(
    userId: string,
    lessonId: string,
    dto: SaveLessonProgressDto,
  ): Promise<LessonProgress> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy bài học với ID '${lessonId}'`);
    }

    let progress = await this.progressRepo.findOne({
      where: { userId, lessonId },
    });

    if (!progress) {
      progress = this.progressRepo.create({
        userId,
        lessonId,
        isCompleted: dto.isCompleted ?? false,
        notes: dto.notes ?? null,
        completedAt: dto.isCompleted ? new Date() : null,
      });
    } else {
      if (dto.isCompleted !== undefined) {
        progress.isCompleted = dto.isCompleted;
        progress.completedAt = dto.isCompleted ? new Date() : null;
      }

      if (dto.notes !== undefined) {
        progress.notes = dto.notes;
      }
    }

    return this.progressRepo.save(progress);
  }

  async getUserCourseProgress(userId: string, courseId: string) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: { lessons: true },
    });

    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID '${courseId}'`);
    }

    const lessons = course.lessons || [];
    if (lessons.length === 0) {
      return {
        completedLessonsCount: 0,
        totalLessonsCount: 0,
        percentComplete: 0,
        progressMap: {},
      };
    }

    const lessonIds = lessons.map((l) => l.id);
    const progressRecords = await this.progressRepo.find({
      where: {
        userId,
        lessonId: In(lessonIds),
      },
    });

    const progressMap: Record<string, { isCompleted: boolean; notes: string | null; completedAt: Date | null }> = {};
    let completedCount = 0;

    for (const record of progressRecords) {
      progressMap[record.lessonId] = {
        isCompleted: record.isCompleted,
        notes: record.notes,
        completedAt: record.completedAt,
      };
      if (record.isCompleted) {
        completedCount++;
      }
    }

    const percentComplete = Math.round((completedCount / lessons.length) * 100);

    return {
      completedLessonsCount: completedCount,
      totalLessonsCount: lessons.length,
      percentComplete,
      progressMap,
    };
  }
}
