import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventCategory, RegistrationStatus } from './enums/event.enums.js';
import { EventsService } from './events.service.js';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepo: any;
  let regRepo: any;

  beforeEach(() => {
    eventRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'event-1' })),
      save: vi.fn(async (e) => ({ ...e, id: e.id || 'event-1' })),
      remove: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn(),
    };

    regRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'reg-1' })),
      save: vi.fn(async (r) => ({ ...r, id: r.id || 'reg-1' })),
      delete: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn(),
    };

    service = new EventsService(eventRepo, regRepo);
  });

  it('creates church event and generates normalized slug', async () => {
    eventRepo.findOne.mockResolvedValue(null);

    const created = await service.createEvent({
      title: 'Đêm Thánh Ca Giáng Sinh',
      titleEn: 'Christmas Candlelight',
      category: EventCategory.WORSHIP,
      campusId: 'Dallas Main Campus',
      startDate: '2026-12-24T19:00:00',
      location: 'Sanctuary',
      requiresRegistration: true,
      maxAttendees: 300,
    });

    expect(eventRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Đêm Thánh Ca Giáng Sinh',
        slug: 'dem-thanh-ca-giang-sinh',
        registeredCount: 0,
      }),
    );
    expect(created.id).toBe('event-1');
  });

  it('allows member to register for an event (RSVP)', async () => {
    const mockEvent = {
      id: 'event-1',
      title: 'Đêm Thánh Ca',
      requiresRegistration: true,
      maxAttendees: 100,
      registeredCount: 10,
    };
    eventRepo.findOne.mockResolvedValue(mockEvent);
    regRepo.findOne.mockResolvedValue(null);

    const reg = await service.registerForEvent('event-1', 'user-1', {
      attendeeName: 'Nguyen Van A',
      attendeeEmail: 'a@example.com',
      adultCount: 2,
      childCount: 1,
    });

    expect(reg.status).toBe(RegistrationStatus.CONFIRMED);
    expect(reg.adultCount).toBe(2);
    expect(reg.childCount).toBe(1);
    expect(mockEvent.registeredCount).toBe(13); // 10 + 3
    expect(eventRepo.save).toHaveBeenCalledWith(mockEvent);
  });

  it('prevents duplicate registration for the same event', async () => {
    eventRepo.findOne.mockResolvedValue({
      id: 'event-1',
      requiresRegistration: true,
    });
    regRepo.findOne.mockResolvedValue({ id: 'existing-reg', status: RegistrationStatus.CONFIRMED });

    await expect(
      service.registerForEvent('event-1', 'user-1', {
        attendeeName: 'Nguyen Van A',
        attendeeEmail: 'a@example.com',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('assigns waitlist status when event reaches maximum attendee capacity', async () => {
    const mockEvent = {
      id: 'event-1',
      requiresRegistration: true,
      maxAttendees: 50,
      registeredCount: 49,
    };
    eventRepo.findOne.mockResolvedValue(mockEvent);
    regRepo.findOne.mockResolvedValue(null);

    const reg = await service.registerForEvent('event-1', 'user-1', {
      attendeeName: 'Gia đình B',
      attendeeEmail: 'b@example.com',
      adultCount: 2,
      childCount: 0,
    });

    expect(reg.status).toBe(RegistrationStatus.WAITLIST);
    expect(mockEvent.registeredCount).toBe(49); // Not incremented because waitlist
  });

  it('allows member to cancel registration and decrements registered count', async () => {
    const mockEvent = { id: 'event-1', registeredCount: 25 };
    const mockReg = {
      id: 'reg-1',
      eventId: 'event-1',
      userId: 'user-1',
      adultCount: 2,
      childCount: 1,
      status: RegistrationStatus.CONFIRMED,
    };

    regRepo.findOne.mockResolvedValue(mockReg);
    eventRepo.findOne.mockResolvedValue(mockEvent);

    const result = await service.cancelRegistration('reg-1', 'user-1');

    expect(result.success).toBe(true);
    expect(mockReg.status).toBe(RegistrationStatus.CANCELLED);
    expect(mockEvent.registeredCount).toBe(22); // 25 - 3
    expect(eventRepo.save).toHaveBeenCalledWith(mockEvent);
  });

  it('prevents user from cancelling someone elses registration', async () => {
    regRepo.findOne.mockResolvedValue({
      id: 'reg-1',
      userId: 'user-original',
      status: RegistrationStatus.CONFIRMED,
    });

    await expect(
      service.cancelRegistration('reg-1', 'user-attacker'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('filters events using query builder', async () => {
    const mockEvents = [
      { id: 'e1', title: 'Thanksgiving', campusId: 'Dallas Main Campus' },
      { id: 'e2', title: 'Christmas', campusId: 'Dallas Main Campus' },
    ];

    eventRepo.createQueryBuilder.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue(mockEvents),
    });

    const results = await service.findAll({
      campusId: 'Dallas Main Campus',
      category: EventCategory.WORSHIP,
    });

    expect(results).toHaveLength(2);
  });
});
