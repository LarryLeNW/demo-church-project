import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '../users/entities/user.entity.js';
import { CommunicationsService } from './communications.service.js';
import { ChurchBulletin } from './entities/church-bulletin.entity.js';
import { ChurchCommunication } from './entities/church-communication.entity.js';
import {
  CommunicationChannel,
  CommunicationType,
  TargetAudience,
} from './enums/communication.enums.js';

describe('CommunicationsService', () => {
  let service: CommunicationsService;
  let commRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findAndCount: ReturnType<typeof vi.fn>;
  };
  let bulletinRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let userRepo: {
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    commRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((c) => Promise.resolve({ id: 'comm-uuid-1', ...c })),
      findAndCount: vi.fn().mockResolvedValue([[], 0]),
    };

    bulletinRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((b) => Promise.resolve({ id: 'bulletin-uuid-1', ...b })),
      findOne: vi.fn(),
      find: vi.fn().mockResolvedValue([]),
    };

    userRepo = {
      createQueryBuilder: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([
          { id: 'u1', fullName: 'Member One', phone: '2145550101', email: 'm1@example.com' },
          { id: 'u2', fullName: 'Member Two', phone: '2145550102', email: 'm2@example.com' },
        ]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationsService,
        { provide: getRepositoryToken(ChurchCommunication), useValue: commRepo },
        { provide: getRepositoryToken(ChurchBulletin), useValue: bulletinRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<CommunicationsService>(CommunicationsService);
  });

  describe('sendBroadcast', () => {
    it('dispatches SMS broadcast, tracks recipient count, and saves record', async () => {
      const result = await service.sendBroadcast('pastor-uuid', {
        channel: CommunicationChannel.SMS,
        type: CommunicationType.EmergencyAlert,
        targetAudience: TargetAudience.AllMembers,
        title: 'CẢNH BÁO BÃO TUYẾT',
        content: 'Chuyển buổi nhóm sang trực tuyến Zoom lúc 19:30',
      });

      expect(result.success).toBe(true);
      expect(result.recipientsCount).toBe(2);
      expect(commRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'pastor-uuid',
          channel: CommunicationChannel.SMS,
          type: CommunicationType.EmergencyAlert,
          title: 'CẢNH BÁO BÃO TUYẾT',
          recipientCount: 2,
        }),
      );
      expect(result.communication.id).toBe('comm-uuid-1');
    });
  });

  describe('getLatestBulletin', () => {
    it('returns bulletin when available', async () => {
      const mockBulletin = {
        id: 'b1',
        title: 'Bản Tin Tuần',
        isPublished: true,
      };
      bulletinRepo.findOne.mockResolvedValueOnce(mockBulletin);

      const result = await service.getLatestBulletin();
      expect(result.title).toBe('Bản Tin Tuần');
    });

    it('throws NotFoundException when no bulletin exists', async () => {
      bulletinRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.getLatestBulletin()).rejects.toThrow(NotFoundException);
    });
  });

  describe('createOrUpdateBulletin', () => {
    it('creates and saves new church bulletin', async () => {
      const result = await service.createOrUpdateBulletin({
        title: 'Bản Tin Thờ Phượng',
        bulletinDate: '2026-03-22',
        themeScripture: 'Thi Thiên 100:1-5',
        sermonTitle: 'Hãy Cất Tiếng Reo Mừng',
        preacherName: 'Rev. Barnabas',
        orderOfService: [],
        announcements: [],
        prayerFocus: 'Cầu thay cho giới trẻ',
      });

      expect(result.id).toBe('bulletin-uuid-1');
      expect(bulletinRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Bản Tin Thờ Phượng',
          bulletinDate: '2026-03-22',
          sermonTitle: 'Hãy Cất Tiếng Reo Mừng',
        }),
      );
    });
  });
});
