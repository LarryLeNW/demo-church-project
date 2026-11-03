import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '../common/enums/role.enum.js';
import { GroupAttendance } from '../groups/entities/group-attendance.entity.js';
import { User } from '../users/entities/user.entity.js';
import { PastoralVisitLog } from './entities/pastoral-visit-log.entity.js';
import { PrayerIntercession } from './entities/prayer-intercession.entity.js';
import { PrayerRequest } from './entities/prayer-request.entity.js';
import { PrayerCategory, PrayerStatus } from './enums/prayer.enums.js';
import { PrayersService } from './prayers.service.js';

describe('PrayersService', () => {
  let service: PrayersService;
  let prayerRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let intercessionRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let visitLogRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let userRepo: {
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let attendanceRepo: {
    find: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    prayerRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((p) => Promise.resolve({ id: 'prayer-uuid-1', ...p })),
      findOne: vi.fn(),
      find: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    intercessionRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((i) => Promise.resolve({ id: 'intercession-uuid-1', ...i })),
      findOne: vi.fn(),
      find: vi.fn(),
    };

    visitLogRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((v) => Promise.resolve({ id: 'log-uuid-1', ...v })),
      find: vi.fn().mockResolvedValue([]),
    };

    userRepo = {
      findOne: vi.fn(),
      find: vi.fn().mockResolvedValue([]),
    };

    attendanceRepo = {
      find: vi.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrayersService,
        { provide: getRepositoryToken(PrayerRequest), useValue: prayerRepo },
        { provide: getRepositoryToken(PrayerIntercession), useValue: intercessionRepo },
        { provide: getRepositoryToken(PastoralVisitLog), useValue: visitLogRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(GroupAttendance), useValue: attendanceRepo },
      ],
    }).compile();

    service = module.get<PrayersService>(PrayersService);
  });

  describe('create', () => {
    it('creates prayer request with user name and initial zero count', async () => {
      const mockUser = {
        id: 'u1',
        fullName: 'Chấp sự John Tran',
        email: 'john@example.com',
      } as User;

      const result = await service.create(mockUser, {
        title: 'Cầu nguyện cho ban ẩm thực',
        content: 'Xin Chúa ban sức mới cho quý bà quý cô nấu ăn Chúa Nhật',
        category: PrayerCategory.Ministry,
      });

      expect(result.id).toBe('prayer-uuid-1');
      expect(prayerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          authorName: 'Chấp sự John Tran',
          title: 'Cầu nguyện cho ban ẩm thực',
          category: PrayerCategory.Ministry,
          prayerCount: 0,
          status: PrayerStatus.Approved,
        }),
      );
    });

    it('sets authorName to anonymous when isAnonymous is true', async () => {
      const mockUser = {
        id: 'u1',
        fullName: 'Chấp sự John Tran',
      } as User;

      await service.create(mockUser, {
        title: 'Lời cầu xin giấu tên',
        content: 'Xin cầu nguyện cho nan đề riêng của gia đình',
        isAnonymous: true,
      });

      expect(prayerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          authorName: 'Tín Hữu Ẩn Danh',
          isAnonymous: true,
        }),
      );
    });
  });

  describe('intercede', () => {
    it('increments prayerCount when user intercedes for the first time', async () => {
      prayerRepo.findOne.mockResolvedValue({
        id: 'p1',
        prayerCount: 5,
      });
      intercessionRepo.findOne.mockResolvedValue(null);

      const result = await service.intercede('p1', 'user-2');

      expect(result.alreadyInterceded).toBe(false);
      expect(result.prayerCount).toBe(6);
      expect(intercessionRepo.create).toHaveBeenCalledWith({
        prayerRequestId: 'p1',
        userId: 'user-2',
      });
    });

    it('returns existing count and flag if user has already interceded', async () => {
      prayerRepo.findOne.mockResolvedValue({
        id: 'p1',
        prayerCount: 5,
      });
      intercessionRepo.findOne.mockResolvedValue({ id: 'i1' });

      const result = await service.intercede('p1', 'user-2');

      expect(result.alreadyInterceded).toBe(true);
      expect(result.prayerCount).toBe(5);
      expect(intercessionRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('recordTestimony', () => {
    it('records praise report and marks prayer as answered', async () => {
      prayerRepo.findOne.mockResolvedValue({
        id: 'p1',
        userId: 'u1',
        isAnswered: false,
      });

      const user = { id: 'u1', role: Role.Member } as User;
      await service.recordTestimony('p1', user, {
        praiseReport: 'Chúa đã nhậm lời và ban ơn lạ lùng!',
      });

      expect(prayerRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isAnswered: true,
          praiseReport: 'Chúa đã nhậm lời và ban ơn lạ lùng!',
        }),
      );
    });

    it('throws ForbiddenException if user is not author and not pastor', async () => {
      prayerRepo.findOne.mockResolvedValue({
        id: 'p1',
        userId: 'other-user',
      });

      const user = { id: 'u1', role: Role.Member } as User;
      await expect(
        service.recordTestimony('p1', user, {
          praiseReport: 'Lời chứng mạo danh',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
