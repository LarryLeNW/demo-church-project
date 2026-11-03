import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GroupsService } from './groups.service.js';
import { SmallGroup } from './entities/small-group.entity.js';
import { GroupMember } from './entities/group-member.entity.js';
import { GroupAttendance } from './entities/group-attendance.entity.js';
import { GroupCategory } from './enums/group.enums.js';

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let memberRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let attendanceRepo: {
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    groupRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((g) => Promise.resolve({ id: 'group-uuid-1', ...g })),
      findOne: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    memberRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((m) => Promise.resolve({ id: 'member-uuid-1', ...m })),
      findOne: vi.fn(),
      find: vi.fn(),
      delete: vi.fn(),
    };

    attendanceRepo = {
      createQueryBuilder: vi.fn(),
    };

    const dataSource = {
      transaction: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: getRepositoryToken(SmallGroup), useValue: groupRepo },
        { provide: getRepositoryToken(GroupMember), useValue: memberRepo },
        { provide: getRepositoryToken(GroupAttendance), useValue: attendanceRepo },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  describe('create', () => {
    it('creates small group and adds leader as member', async () => {
      groupRepo.findOne.mockResolvedValue({
        id: 'group-uuid-1',
        name: 'Nhóm Gia Đình Trẻ Dallas',
        leaderId: 'pastor-uuid',
        category: GroupCategory.Families,
        scheduleRule: 'Thứ Sáu 19:30',
      });

      const result = await service.create({
        name: 'Nhóm Gia Đình Trẻ Dallas',
        leaderId: 'pastor-uuid',
        category: GroupCategory.Families,
        scheduleRule: 'Thứ Sáu 19:30',
      });

      expect(result.id).toBe('group-uuid-1');
      expect(groupRepo.create).toHaveBeenCalled();
      expect(memberRepo.create).toHaveBeenCalledWith({
        groupId: 'group-uuid-1',
        userId: 'pastor-uuid',
      });
    });
  });
});
