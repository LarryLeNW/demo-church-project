import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacilityRoom } from './entities/facility-room.entity.js';
import { FacilityReservation } from './entities/facility-reservation.entity.js';
import { EquipmentItem } from './entities/equipment-item.entity.js';
import { ReservationStatus } from './enums/facility.enums.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReviewReservationDto } from './dto/review-reservation.dto.js';
import { ReservationQueryDto } from './dto/reservation-query.dto.js';
import { CreateRoomDto } from './dto/create-room.dto.js';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(FacilityRoom)
    private readonly roomRepo: Repository<FacilityRoom>,
    @InjectRepository(FacilityReservation)
    private readonly reservationRepo: Repository<FacilityReservation>,
    @InjectRepository(EquipmentItem)
    private readonly equipmentRepo: Repository<EquipmentItem>,
  ) {}

  async getRooms(campusId?: string): Promise<FacilityRoom[]> {
    const qb = this.roomRepo.createQueryBuilder('r');
    if (campusId && campusId !== 'all') {
      qb.andWhere('r.campus_id = :campusId', { campusId });
    }
    return qb.orderBy('r.capacity', 'DESC').getMany();
  }

  async getRoomById(id: string): Promise<FacilityRoom> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Không tìm thấy thông tin phòng nhóm này.');
    }
    return room;
  }

  async createRoom(dto: CreateRoomDto): Promise<FacilityRoom> {
    const room = this.roomRepo.create({
      name: dto.name,
      type: dto.type,
      campusId: dto.campusId || 'Dallas Main Campus',
      capacity: dto.capacity,
      amenities: dto.amenities || [],
      requiresApproval: dto.requiresApproval ?? true,
      notes: dto.notes || null,
      isAvailable: true,
    });
    return this.roomRepo.save(room);
  }

  async createReservation(
    userId: string,
    userName: string,
    dto: CreateReservationDto,
  ): Promise<FacilityReservation> {
    const room = await this.getRoomById(dto.roomId);
    if (!room.isAvailable) {
      throw new BadRequestException('Phòng nhóm này hiện đang tạm ngưng sử dụng.');
    }

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Thời gian bắt đầu hoặc kết thúc không hợp lệ.');
    }
    if (end <= start) {
      throw new BadRequestException('Thời gian kết thúc phải diễn ra sau thời gian bắt đầu.');
    }

    // Conflict Check: Check overlapping approved reservations
    const conflicts = await this.reservationRepo
      .createQueryBuilder('res')
      .where('res.room_id = :roomId', { roomId: dto.roomId })
      .andWhere('res.status = :status', { status: ReservationStatus.APPROVED })
      .andWhere('res.start_time < :end AND res.end_time > :start', {
        start: dto.startTime,
        end: dto.endTime,
      })
      .getMany();

    if (conflicts.length > 0) {
      const c = conflicts[0];
      throw new BadRequestException(
        `Xung đột lịch đặt: Phòng ${room.name} đã được duyệt cho sự kiện "${c.eventName}" (${c.ministryName}) từ ${new Date(
          c.startTime,
        ).toLocaleTimeString('vi-VN')} đến ${new Date(c.endTime).toLocaleTimeString('vi-VN')}.`,
      );
    }

    const initialStatus = room.requiresApproval
      ? ReservationStatus.PENDING
      : ReservationStatus.APPROVED;

    const reservation = this.reservationRepo.create({
      roomId: dto.roomId,
      requestedByUserId: userId,
      requestedByUserName: userName,
      eventName: dto.eventName,
      ministryName: dto.ministryName,
      campusId: dto.campusId || room.campusId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      setupNotes: dto.setupNotes || null,
      status: initialStatus,
    });

    return this.reservationRepo.save(reservation);
  }

  async getMyReservations(userId: string): Promise<FacilityReservation[]> {
    return this.reservationRepo.find({
      where: { requestedByUserId: userId },
      relations: { room: true },
      order: { startTime: 'DESC' },
    });
  }

  async getAllReservations(query: ReservationQueryDto): Promise<FacilityReservation[]> {
    const qb = this.reservationRepo
      .createQueryBuilder('res')
      .leftJoinAndSelect('res.room', 'room');

    if (query.campusId && query.campusId !== 'all') {
      qb.andWhere('res.campus_id = :campusId', { campusId: query.campusId });
    }
    if (query.roomId) {
      qb.andWhere('res.room_id = :roomId', { roomId: query.roomId });
    }
    if (query.status) {
      qb.andWhere('res.status = :status', { status: query.status });
    }
    if (query.date) {
      qb.andWhere('res.start_time LIKE :date', { date: `${query.date}%` });
    }

    return qb.orderBy('res.start_time', 'ASC').getMany();
  }

  async reviewReservation(
    id: string,
    reviewerId: string,
    reviewerName: string,
    dto: ReviewReservationDto,
  ): Promise<FacilityReservation> {
    const res = await this.reservationRepo.findOne({
      where: { id },
      relations: { room: true },
    });
    if (!res) {
      throw new NotFoundException('Không tìm thấy đơn đặt phòng nhóm.');
    }

    // If approving, re-check conflict in case another was approved in between
    if (dto.status === ReservationStatus.APPROVED) {
      const conflicts = await this.reservationRepo
        .createQueryBuilder('r')
        .where('r.room_id = :roomId', { roomId: res.roomId })
        .andWhere('r.id != :id', { id: res.id })
        .andWhere('r.status = :status', { status: ReservationStatus.APPROVED })
        .andWhere('r.start_time < :end AND r.end_time > :start', {
          start: res.startTime,
          end: res.endTime,
        })
        .getMany();

      if (conflicts.length > 0) {
        throw new BadRequestException('Đã có đơn đặt phòng khác được duyệt trong khoảng thời gian này.');
      }
    }

    res.status = dto.status;
    res.approvedByUserId = reviewerId;
    res.approvedByUserName = reviewerName;
    res.rejectionReason = dto.rejectionReason || null;

    return this.reservationRepo.save(res);
  }

  async getEquipment(campusId?: string): Promise<EquipmentItem[]> {
    const qb = this.equipmentRepo.createQueryBuilder('eq');
    if (campusId && campusId !== 'all') {
      qb.andWhere('eq.campus_id = :campusId', { campusId });
    }
    return qb.orderBy('eq.name', 'ASC').getMany();
  }

  async getFacilitiesOverview(campusId?: string) {
    const roomQb = this.roomRepo.createQueryBuilder('r');
    if (campusId && campusId !== 'all') {
      roomQb.andWhere('r.campus_id = :campusId', { campusId });
    }
    const rooms = await roomQb.getMany();

    const resQb = this.reservationRepo.createQueryBuilder('res');
    if (campusId && campusId !== 'all') {
      resQb.andWhere('res.campus_id = :campusId', { campusId });
    }
    const allRes = await resQb.getMany();

    const eqQb = this.equipmentRepo.createQueryBuilder('eq');
    if (campusId && campusId !== 'all') {
      eqQb.andWhere('eq.campus_id = :campusId', { campusId });
    }
    const equipments = await eqQb.getMany();

    let pendingCount = 0;
    let approvedCount = 0;
    for (const r of allRes) {
      if (r.status === ReservationStatus.PENDING) pendingCount++;
      if (r.status === ReservationStatus.APPROVED) approvedCount++;
    }

    return {
      totalRooms: rooms.length,
      availableRooms: rooms.filter((r) => r.isAvailable).length,
      pendingReservations: pendingCount,
      approvedReservations: approvedCount,
      totalEquipmentCount: equipments.reduce((sum, e) => sum + e.quantity, 0),
    };
  }
}
