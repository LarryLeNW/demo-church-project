import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EventCategory,
  EventPaymentStatus,
  RegistrationStatus,
} from './enums/event.enums.js';
import { ChurchEvent } from './entities/church-event.entity.js';
import { EventRegistration } from './entities/event-registration.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { RegisterEventDto } from './dto/register-event.dto.js';
import { EventQueryDto } from './dto/event-query.dto.js';

export function slugifyEvent(text: string): string {
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
export class EventsService {
  constructor(
    @InjectRepository(ChurchEvent)
    private readonly eventRepo: Repository<ChurchEvent>,
    @InjectRepository(EventRegistration)
    private readonly regRepo: Repository<EventRegistration>,
  ) {}

  async findAll(query: EventQueryDto): Promise<ChurchEvent[]> {
    const qb = this.eventRepo
      .createQueryBuilder('e')
      .where('e.is_published = :isPublished', { isPublished: true });

    if (query.campusId && query.campusId !== 'all') {
      qb.andWhere('e.campus_id = :campusId', { campusId: query.campusId });
    }

    if (query.category) {
      qb.andWhere('e.category = :category', { category: query.category });
    }

    if (query.search) {
      qb.andWhere(
        '(LOWER(e.title) LIKE :s OR LOWER(e.title_en) LIKE :s OR LOWER(e.location) LIKE :s)',
        { s: `%${query.search.toLowerCase()}%` },
      );
    }

    if (query.upcomingOnly === 'true') {
      const nowIso = new Date().toISOString().split('T')[0];
      qb.andWhere('e.start_date >= :nowIso', { nowIso });
    }

    return qb.orderBy('e.start_date', 'ASC').getMany();
  }

  async findByIdOrSlug(idOrSlug: string): Promise<ChurchEvent> {
    const event = await this.eventRepo.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!event) {
      throw new NotFoundException('Không tìm thấy sự kiện này.');
    }
    return event;
  }

  async createEvent(dto: CreateEventDto): Promise<ChurchEvent> {
    let baseSlug = slugifyEvent(dto.title);
    if (!baseSlug) baseSlug = `event-${Date.now()}`;

    let slug = baseSlug;
    let counter = 1;
    while (await this.eventRepo.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const event = this.eventRepo.create({
      title: dto.title,
      titleEn: dto.titleEn,
      slug,
      description: dto.description || null,
      category: dto.category,
      campusId: dto.campusId,
      startDate: dto.startDate,
      endDate: dto.endDate || null,
      location: dto.location,
      bannerUrl: dto.bannerUrl || null,
      requiresRegistration: dto.requiresRegistration ?? true,
      maxAttendees: dto.maxAttendees || null,
      registeredCount: 0,
      registrationDeadline: dto.registrationDeadline || null,
      cost: dto.cost || 0,
      isPublished: dto.isPublished ?? true,
    });

    return this.eventRepo.save(event);
  }

  async updateEvent(id: string, dto: UpdateEventDto): Promise<ChurchEvent> {
    const event = await this.findByIdOrSlug(id);

    if (dto.title !== undefined) event.title = dto.title;
    if (dto.titleEn !== undefined) event.titleEn = dto.titleEn;
    if (dto.description !== undefined) event.description = dto.description;
    if (dto.category !== undefined) event.category = dto.category;
    if (dto.campusId !== undefined) event.campusId = dto.campusId;
    if (dto.startDate !== undefined) event.startDate = dto.startDate;
    if (dto.endDate !== undefined) event.endDate = dto.endDate;
    if (dto.location !== undefined) event.location = dto.location;
    if (dto.bannerUrl !== undefined) event.bannerUrl = dto.bannerUrl;
    if (dto.requiresRegistration !== undefined) event.requiresRegistration = dto.requiresRegistration;
    if (dto.maxAttendees !== undefined) event.maxAttendees = dto.maxAttendees;
    if (dto.registrationDeadline !== undefined) event.registrationDeadline = dto.registrationDeadline;
    if (dto.cost !== undefined) event.cost = dto.cost;
    if (dto.isPublished !== undefined) event.isPublished = dto.isPublished;

    return this.eventRepo.save(event);
  }

  async deleteEvent(id: string): Promise<{ success: boolean }> {
    const event = await this.findByIdOrSlug(id);
    await this.regRepo.delete({ eventId: event.id });
    await this.eventRepo.remove(event);
    return { success: true };
  }

  async registerForEvent(
    eventId: string,
    userId: string,
    dto: RegisterEventDto,
  ): Promise<EventRegistration> {
    const event = await this.findByIdOrSlug(eventId);

    if (!event.requiresRegistration) {
      throw new BadRequestException('Sự kiện này không yêu cầu đăng ký trước.');
    }

    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      if (new Date() > deadline) {
        throw new BadRequestException('Thời hạn đăng ký sự kiện này đã kết thúc.');
      }
    }

    const existing = await this.regRepo.findOne({
      where: { eventId: event.id, userId, status: RegistrationStatus.CONFIRMED },
    });
    if (existing) {
      throw new BadRequestException('Bạn đã đăng ký tham gia sự kiện này rồi.');
    }

    const additionalAttendees = (dto.adultCount || 1) + (dto.childCount || 0);

    let status = RegistrationStatus.CONFIRMED;
    if (event.maxAttendees && event.registeredCount + additionalAttendees > event.maxAttendees) {
      status = RegistrationStatus.WAITLIST;
    }

    const reg = this.regRepo.create({
      eventId: event.id,
      userId,
      attendeeName: dto.attendeeName,
      attendeeEmail: dto.attendeeEmail,
      attendeePhone: dto.attendeePhone || null,
      adultCount: dto.adultCount || 1,
      childCount: dto.childCount || 0,
      dietaryRestrictions: dto.dietaryRestrictions || null,
      paymentStatus: Number(event.cost) > 0 ? EventPaymentStatus.PENDING : EventPaymentStatus.FREE,
      status,
      notes: dto.notes || null,
    });

    const saved = await this.regRepo.save(reg);

    if (status === RegistrationStatus.CONFIRMED) {
      event.registeredCount += additionalAttendees;
      await this.eventRepo.save(event);
    }

    return saved;
  }

  async getMyRegistrations(userId: string) {
    const registrations = await this.regRepo.find({
      where: { userId },
      order: { registeredAt: 'DESC' },
    });

    if (registrations.length === 0) return [];

    const eventIds = registrations.map((r) => r.eventId);
    const events = await this.eventRepo
      .createQueryBuilder('e')
      .where('e.id IN (:...eventIds)', { eventIds })
      .getMany();

    const eventMap = new Map(events.map((e) => [e.id, e]));

    return registrations.map((reg) => ({
      registration: reg,
      event: eventMap.get(reg.eventId) || null,
    }));
  }

  async cancelRegistration(
    regId: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const reg = await this.regRepo.findOne({ where: { id: regId } });
    if (!reg) {
      throw new NotFoundException('Không tìm thấy thông tin đăng ký.');
    }

    if (reg.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đăng ký của người khác.');
    }

    if (reg.status === RegistrationStatus.CANCELLED) {
      return { success: true };
    }

    const event = await this.eventRepo.findOne({ where: { id: reg.eventId } });
    if (event && reg.status === RegistrationStatus.CONFIRMED) {
      const count = (reg.adultCount || 1) + (reg.childCount || 0);
      event.registeredCount = Math.max(0, event.registeredCount - count);
      await this.eventRepo.save(event);
    }

    reg.status = RegistrationStatus.CANCELLED;
    await this.regRepo.save(reg);

    return { success: true };
  }

  async getAttendees(eventId: string): Promise<EventRegistration[]> {
    const event = await this.findByIdOrSlug(eventId);
    return this.regRepo.find({
      where: { eventId: event.id },
      order: { registeredAt: 'ASC' },
    });
  }
}
