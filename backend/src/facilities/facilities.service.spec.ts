import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FacilityType, ReservationStatus } from './enums/facility.enums.js';
import { FacilitiesService } from './facilities.service.js';

describe('FacilitiesService', () => {
  let service: FacilitiesService;
  let roomRepo: any;
  let reservationRepo: any;
  let equipmentRepo: any;

  beforeEach(() => {
    roomRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'room-1' })),
      save: vi.fn(async (r) => ({ ...r, id: r.id || 'room-1' })),
      createQueryBuilder: vi.fn(),
    };

    reservationRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'res-1' })),
      save: vi.fn(async (res) => ({ ...res, id: res.id || 'res-1' })),
      createQueryBuilder: vi.fn(),
    };

    equipmentRepo = {
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'eq-1' })),
      save: vi.fn(async (eq) => ({ ...eq, id: eq.id || 'eq-1' })),
      createQueryBuilder: vi.fn(),
    };

    service = new FacilitiesService(roomRepo, reservationRepo, equipmentRepo);
  });

  it('creates and returns a facility room with amenities', async () => {
    const room = await service.createRoom({
      name: 'Thánh Đường Lớn',
      type: FacilityType.SANCTUARY,
      campusId: 'Dallas Main Campus',
      capacity: 450,
      amenities: ['Behringer X32', 'Laser 4K Projector', 'Yamaha C7 Piano'],
      requiresApproval: true,
    });

    expect(roomRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Thánh Đường Lớn',
        capacity: 450,
        isAvailable: true,
      }),
    );
    expect(room.id).toBe('room-1');
  });

  it('throws NotFoundException when room does not exist', async () => {
    roomRepo.findOne.mockResolvedValue(null);

    await expect(service.getRoomById('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('creates a reservation with PENDING status when room requires approval', async () => {
    roomRepo.findOne.mockResolvedValue({
      id: 'room-1',
      name: 'Thánh Đường Lớn',
      isAvailable: true,
      requiresApproval: true,
      campusId: 'Dallas Main Campus',
    });

    const mockQb = {
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([]), // No conflicts
    };
    reservationRepo.createQueryBuilder.mockReturnValue(mockQb);

    const reservation = await service.createReservation('user-1', 'Nguyễn Anh Tuấn', {
      roomId: 'room-1',
      eventName: 'Tập Hát Ban Thờ Phượng',
      ministryName: 'Ban Thờ Phượng & Media',
      startTime: '2026-11-07T18:00:00Z',
      endTime: '2026-11-07T21:00:00Z',
      setupNotes: 'Mở 4 micro không dây Shure',
    });

    expect(reservationRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        roomId: 'room-1',
        eventName: 'Tập Hát Ban Thờ Phượng',
        status: ReservationStatus.PENDING,
      }),
    );
    expect(reservation.id).toBe('res-1');
  });

  it('rejects reservation creation if there is an overlapping approved booking (conflict prevention)', async () => {
    roomRepo.findOne.mockResolvedValue({
      id: 'room-1',
      name: 'Thánh Đường Lớn',
      isAvailable: true,
      requiresApproval: true,
      campusId: 'Dallas Main Campus',
    });

    const mockQb = {
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([
        {
          id: 'res-existing',
          eventName: 'Lễ Thành Hôn',
          ministryName: 'Ban Khánh Tiết',
          startTime: '2026-11-07T17:00:00Z',
          endTime: '2026-11-07T19:30:00Z',
        },
      ]), // Conflict!
    };
    reservationRepo.createQueryBuilder.mockReturnValue(mockQb);

    await expect(
      service.createReservation('user-1', 'Nguyễn Anh Tuấn', {
        roomId: 'room-1',
        eventName: 'Tập Hát Ban Thờ Phượng',
        ministryName: 'Ban Thờ Phượng & Media',
        startTime: '2026-11-07T18:00:00Z',
        endTime: '2026-11-07T21:00:00Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('allows pastor or admin to approve a reservation', async () => {
    reservationRepo.findOne.mockResolvedValue({
      id: 'res-1',
      roomId: 'room-1',
      startTime: '2026-11-07T18:00:00Z',
      endTime: '2026-11-07T21:00:00Z',
      status: ReservationStatus.PENDING,
    });

    const mockQb = {
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([]), // No conflicts
    };
    reservationRepo.createQueryBuilder.mockReturnValue(mockQb);

    const approved = await service.reviewReservation(
      'res-1',
      'pastor-1',
      'Mục Sư Quản Nhiệm',
      { status: ReservationStatus.APPROVED },
    );

    expect(approved.status).toBe(ReservationStatus.APPROVED);
    expect(approved.approvedByUserName).toBe('Mục Sư Quản Nhiệm');
  });

  it('calculates facilities overview statistics', async () => {
    const mockRoomQb = {
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([
        { id: 'r1', isAvailable: true },
        { id: 'r2', isAvailable: true },
        { id: 'r3', isAvailable: false },
      ]),
    };
    roomRepo.createQueryBuilder.mockReturnValue(mockRoomQb);

    const mockResQb = {
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([
        { status: ReservationStatus.PENDING },
        { status: ReservationStatus.PENDING },
        { status: ReservationStatus.APPROVED },
      ]),
    };
    reservationRepo.createQueryBuilder.mockReturnValue(mockResQb);

    const mockEqQb = {
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([
        { quantity: 4 },
        { quantity: 8 },
      ]),
    };
    equipmentRepo.createQueryBuilder.mockReturnValue(mockEqQb);

    const overview = await service.getFacilitiesOverview();

    expect(overview.totalRooms).toBe(3);
    expect(overview.availableRooms).toBe(2);
    expect(overview.pendingReservations).toBe(2);
    expect(overview.approvedReservations).toBe(1);
    expect(overview.totalEquipmentCount).toBe(12);
  });
});
