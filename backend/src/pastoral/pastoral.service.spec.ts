import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import {
  CareStatus,
  CareType,
  CareUrgency,
} from './enums/pastoral.enums.js';
import { PastoralService } from './pastoral.service.js';

describe('PastoralService', () => {
  let service: PastoralService;
  let careRepo: any;
  let householdRepo: any;

  beforeEach(() => {
    careRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'care-1' })),
      save: vi.fn(async (c) => ({ ...c, id: c.id || 'care-1' })),
      createQueryBuilder: vi.fn(),
    };

    householdRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'house-1' })),
      save: vi.fn(async (h) => ({ ...h, id: h.id || 'house-1' })),
      createQueryBuilder: vi.fn(),
    };

    service = new PastoralService(careRepo, householdRepo);
  });

  it('creates an emergency hospital visitation request with status PENDING', async () => {
    const created = await service.createCareRequest('user-10', {
      requestType: CareType.HOSPITAL_VISIT,
      urgency: CareUrgency.EMERGENCY,
      patientOrMemberName: 'Bác Trương Minh Hải',
      hospitalOrAddress: 'Baylor Scott & White Health (Plano, TX) - Phòng Cấp Cứu 304',
      contactPhone: '(469) 555-0199',
      description: 'Bác vừa vào phòng cấp cứu, gia đình xin Mục sư đến cầu nguyện đặt tay xức dầu.',
      campusId: 'Dallas Main Campus',
    });

    expect(careRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-10',
        requestType: CareType.HOSPITAL_VISIT,
        urgency: CareUrgency.EMERGENCY,
        status: CareStatus.PENDING,
      }),
    );
    expect(created.id).toBe('care-1');
  });

  it('retrieves user requests ordered by creation date', async () => {
    careRepo.find.mockResolvedValue([
      { id: 'care-1', userId: 'user-10', status: CareStatus.PENDING },
    ]);

    const result = await service.getMyCareRequests('user-10');
    expect(careRepo.find).toHaveBeenCalledWith({
      where: { userId: 'user-10' },
      order: { createdAt: 'DESC' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('care-1');
  });

  it('assigns a pastor to a care request and updates status to SCHEDULED', async () => {
    careRepo.findOne.mockResolvedValue({
      id: 'care-1',
      status: CareStatus.PENDING,
      assignedPastorId: null,
      assignedPastorName: null,
      scheduledAt: null,
    });

    const updated = await service.assignCareRequest('care-1', {
      assignedPastorId: 'pastor-1',
      assignedPastorName: 'Mục sư Nguyễn Văn A',
      scheduledAt: '2026-11-03T10:00:00Z',
    });

    expect(updated.assignedPastorId).toBe('pastor-1');
    expect(updated.assignedPastorName).toBe('Mục sư Nguyễn Văn A');
    expect(updated.status).toBe(CareStatus.SCHEDULED);
    expect(updated.scheduledAt).toBe('2026-11-03T10:00:00Z');
  });

  it('completes a pastoral care request and saves visitation report', async () => {
    careRepo.findOne.mockResolvedValue({
      id: 'care-1',
      status: CareStatus.SCHEDULED,
      pastoralReport: null,
    });

    const completed = await service.completeCareRequest('care-1', {
      pastoralReport: 'Mục sư và Ban Chăm sóc đã đến thăm, cầu nguyện bình an. Tín hữu đã qua cơn nguy kịch.',
    });

    expect(completed.status).toBe(CareStatus.COMPLETED);
    expect(completed.pastoralReport).toContain('qua cơn nguy kịch');
  });

  it('throws NotFoundException when care request does not exist', async () => {
    careRepo.findOne.mockResolvedValue(null);

    await expect(
      service.assignCareRequest('non-existent', {
        assignedPastorId: 'pastor-1',
        assignedPastorName: 'Mục sư A',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('creates and retrieves a family household directory entry', async () => {
    const household = await service.createHousehold({
      name: 'Gia đình Bác Trần Minh Long',
      campusId: 'Dallas Main Campus',
      primaryPhone: '(214) 555-8821',
      addressLine1: '3200 McDermott Rd',
      city: 'Plano',
      state: 'TX',
      zipcode: '75025',
      weddingAnniversary: '1988-06-18',
      members: [
        { fullName: 'Trần Minh Long', roleInFamily: 'head' },
        { fullName: 'Nguyễn Thị Bích Mai', roleInFamily: 'spouse' },
      ],
      notes: 'Gia đình trung tín phục vụ ban ẩm thực và khánh tiết',
    });

    expect(householdRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Gia đình Bác Trần Minh Long',
        city: 'Plano',
        state: 'TX',
      }),
    );
    expect(household.id).toBe('house-1');
  });

  it('calculates pastoral overview statistics', async () => {
    const mockRequests = [
      { status: CareStatus.PENDING, urgency: CareUrgency.EMERGENCY },
      { status: CareStatus.PENDING, urgency: CareUrgency.ROUTINE },
      { status: CareStatus.SCHEDULED, urgency: CareUrgency.URGENT },
      { status: CareStatus.COMPLETED, urgency: CareUrgency.ROUTINE },
    ];

    const mockCareQb = {
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue(mockRequests),
    };
    careRepo.createQueryBuilder.mockReturnValue(mockCareQb);

    const mockHouseQb = {
      andWhere: vi.fn().mockReturnThis(),
      getCount: vi.fn().mockResolvedValue(12),
    };
    householdRepo.createQueryBuilder.mockReturnValue(mockHouseQb);

    const stats = await service.getPastoralOverview('Dallas Main Campus');

    expect(stats.totalRequests).toBe(4);
    expect(stats.pendingCount).toBe(2);
    expect(stats.emergencyCount).toBe(1);
    expect(stats.scheduledCount).toBe(1);
    expect(stats.completedCount).toBe(1);
    expect(stats.totalHouseholds).toBe(12);
  });
});
