import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '../users/entities/user.entity.js';
import { ChildrenService } from './children.service.js';
import { ChildCheckin } from './entities/child-checkin.entity.js';
import { ChildProfile } from './entities/child-profile.entity.js';
import { CheckinStatus, Classroom } from './enums/children.enums.js';

describe('ChildrenService', () => {
  let service: ChildrenService;
  let profileRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let checkinRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let userRepo: {
    findOne: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    profileRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((c) => Promise.resolve({ id: 'child-uuid-1', ...c })),
      find: vi.fn(),
    };

    checkinRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((c) => Promise.resolve({ id: 'checkin-uuid-1', ...c })),
      findOne: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    userRepo = {
      findOne: vi.fn().mockResolvedValue({ id: 'parent-1', fullName: 'David Tran' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildrenService,
        { provide: getRepositoryToken(ChildProfile), useValue: profileRepo },
        { provide: getRepositoryToken(ChildCheckin), useValue: checkinRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<ChildrenService>(ChildrenService);
  });

  describe('registerChild', () => {
    it('creates child profile with emergency phone and classroom', async () => {
      const result = await service.registerChild('parent-1', {
        fullName: 'Joshua Tran',
        birthDate: '2020-05-10',
        classroom: Classroom.Preschool,
        allergies: 'Peanuts',
        emergencyContactName: 'David Tran',
        emergencyContactPhone: '(214) 555-0100',
      });

      expect(result.id).toBe('child-uuid-1');
      expect(profileRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parentId: 'parent-1',
          fullName: 'Joshua Tran',
          classroom: Classroom.Preschool,
          allergies: 'Peanuts',
        }),
      );
    });
  });

  describe('checkinChildren', () => {
    it('generates security code and returns printable badges and claim ticket', async () => {
      profileRepo.find.mockResolvedValueOnce([
        {
          id: 'child-1',
          fullName: 'Joshua Tran',
          classroom: Classroom.Preschool,
          allergies: 'Peanuts',
          emergencyContactName: 'David Tran',
          emergencyContactPhone: '(214) 555-0100',
          parent: { fullName: 'David Tran' },
        },
      ]);
      checkinRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.checkinChildren('parent-1', 'parent-1', {
        childIds: ['child-1'],
      });

      expect(result.success).toBe(true);
      expect(result.securityCode).toMatch(/^[A-Z]-\d{4}$/);
      expect(result.guardianClaimTicket.securityCode).toBe(result.securityCode);
      expect(result.childBadges).toHaveLength(1);
      expect(result.childBadges[0].fullName).toBe('Joshua Tran');
    });
  });

  describe('checkoutChild', () => {
    it('throws BadRequestException when security code does not match', async () => {
      checkinRepo.findOne.mockResolvedValueOnce({
        id: 'ck-1',
        securityCode: 'G-7429',
        status: CheckinStatus.CheckedIn,
        child: { fullName: 'Joshua Tran' },
      });

      await expect(
        service.checkoutChild('ck-1', 'WRONG-CODE', 'teacher-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('succeeds when security code matches', async () => {
      const mockCheckin = {
        id: 'ck-1',
        securityCode: 'G-7429',
        status: CheckinStatus.CheckedIn,
        child: { fullName: 'Joshua Tran' },
      };
      checkinRepo.findOne.mockResolvedValueOnce(mockCheckin);

      const result = await service.checkoutChild('ck-1', 'G-7429', 'teacher-1');

      expect(result.success).toBe(true);
      expect(checkinRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: CheckinStatus.CheckedOut,
          checkedOutByUserId: 'teacher-1',
        }),
      );
    });
  });
});
