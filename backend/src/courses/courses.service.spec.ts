import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CoursesService, slugify } from './courses.service.js';
import { Course } from './entities/course.entity.js';
import { LessonProgress } from './entities/lesson-progress.entity.js';
import { Lesson } from './entities/lesson.entity.js';
import { CourseCategory, CourseLanguage } from './enums/course.enums.js';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let lessonRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let progressRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    courseRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((c) => Promise.resolve({ id: 'course-uuid-1', ...c })),
      findOne: vi.fn(),
      remove: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    lessonRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((l) => Promise.resolve({ id: 'lesson-uuid-1', ...l })),
      findOne: vi.fn(),
      remove: vi.fn(),
    };

    progressRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((p) => Promise.resolve({ id: 'progress-uuid-1', ...p })),
      findOne: vi.fn(),
      find: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: courseRepo },
        { provide: getRepositoryToken(Lesson), useValue: lessonRepo },
        { provide: getRepositoryToken(LessonProgress), useValue: progressRepo },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  describe('slugify', () => {
    it('normalizes Vietnamese characters to clean ascii slug', () => {
      expect(slugify('Nền Tảng Đời Sống Cơ Đốc')).toBe('nen-tang-doi-song-co-doc');
      expect(slugify('Đức Chúa Trời Yêu Thương')).toBe('duc-chua-troi-yeu-thuong');
    });
  });

  describe('findBySlug', () => {
    it('returns course when slug matches', async () => {
      const mockCourse = {
        id: 'c1',
        slug: 'nen-tang-doi-song-co-doc',
        title: 'Nền Tảng Đời Sống Cơ Đốc',
        lessons: [],
      };
      courseRepo.findOne.mockResolvedValue(mockCourse);

      const result = await service.findBySlug('nen-tang-doi-song-co-doc');
      expect(result).toEqual(mockCourse);
    });

    it('throws NotFoundException when slug does not exist', async () => {
      courseRepo.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('khong-ton-tai')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('generates slug if not provided and saves course', async () => {
      courseRepo.findOne.mockResolvedValue(null);

      const result = await service.create({
        title: 'Thần Học Cơ Đốc Căn Bản',
        category: CourseCategory.Theology,
        language: CourseLanguage.Vietnamese,
      });

      expect(result.id).toBe('course-uuid-1');
      expect(courseRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'than-hoc-co-doc-can-ban',
        }),
      );
    });
  });

  describe('saveLessonProgress', () => {
    it('creates or updates progress with completion and notes', async () => {
      lessonRepo.findOne.mockResolvedValue({ id: 'lesson-1', title: 'Bài 1' });
      progressRepo.findOne.mockResolvedValue(null);

      const result = await service.saveLessonProgress('user-1', 'lesson-1', {
        isCompleted: true,
        notes: 'Cầu nguyện mỗi sáng',
      });

      expect(result.id).toBe('progress-uuid-1');
      expect(progressRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          lessonId: 'lesson-1',
          isCompleted: true,
          notes: 'Cầu nguyện mỗi sáng',
        }),
      );
      expect(progressRepo.save).toHaveBeenCalled();
    });
  });

  describe('getUserCourseProgress', () => {
    it('calculates correct percentage of completed lessons', async () => {
      courseRepo.findOne.mockResolvedValue({
        id: 'c1',
        lessons: [
          { id: 'l1', title: 'Bài 1' },
          { id: 'l2', title: 'Bài 2' },
        ],
      });

      progressRepo.find.mockResolvedValue([
        { lessonId: 'l1', isCompleted: true, notes: 'Ghi chú 1', completedAt: new Date() },
      ]);

      const result = await service.getUserCourseProgress('user-1', 'c1');
      expect(result.completedLessonsCount).toBe(1);
      expect(result.totalLessonsCount).toBe(2);
      expect(result.percentComplete).toBe(50);
      expect(result.progressMap['l1'].isCompleted).toBe(true);
    });
  });
});
