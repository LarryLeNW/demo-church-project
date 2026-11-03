import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CareStatus,
  CareUrgency,
} from './enums/pastoral.enums.js';
import { Household } from './entities/household.entity.js';
import { PastoralCareRequest } from './entities/pastoral-care-request.entity.js';
import { CreateCareRequestDto } from './dto/create-care-request.dto.js';
import { AssignCareRequestDto, CompleteCareRequestDto } from './dto/assign-care-request.dto.js';
import { CreateHouseholdDto } from './dto/create-household.dto.js';
import { CareQueryDto } from './dto/care-query.dto.js';

@Injectable()
export class PastoralService {
  constructor(
    @InjectRepository(PastoralCareRequest)
    private readonly careRepo: Repository<PastoralCareRequest>,
    @InjectRepository(Household)
    private readonly householdRepo: Repository<Household>,
  ) {}

  async createCareRequest(
    userId: string,
    dto: CreateCareRequestDto,
  ): Promise<PastoralCareRequest> {
    const request = this.careRepo.create({
      userId,
      householdId: dto.householdId || null,
      requestType: dto.requestType,
      urgency: dto.urgency,
      patientOrMemberName: dto.patientOrMemberName,
      hospitalOrAddress: dto.hospitalOrAddress,
      contactPhone: dto.contactPhone,
      description: dto.description,
      campusId: dto.campusId || 'Dallas Main Campus',
      status: CareStatus.PENDING,
    });

    return this.careRepo.save(request);
  }

  async getMyCareRequests(userId: string): Promise<PastoralCareRequest[]> {
    return this.careRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllCareRequests(query: CareQueryDto): Promise<PastoralCareRequest[]> {
    const qb = this.careRepo.createQueryBuilder('c');

    if (query.campusId && query.campusId !== 'all') {
      qb.andWhere('c.campus_id = :campusId', { campusId: query.campusId });
    }
    if (query.requestType) {
      qb.andWhere('c.request_type = :type', { type: query.requestType });
    }
    if (query.urgency) {
      qb.andWhere('c.urgency = :urgency', { urgency: query.urgency });
    }
    if (query.status) {
      qb.andWhere('c.status = :status', { status: query.status });
    }
    if (query.search) {
      qb.andWhere(
        '(LOWER(c.patient_or_member_name) LIKE :s OR LOWER(c.hospital_or_address) LIKE :s OR LOWER(c.contact_phone) LIKE :s)',
        { s: `%${query.search.toLowerCase()}%` },
      );
    }

    return qb
      .addOrderBy('CASE WHEN c.urgency = "emergency" THEN 1 WHEN c.urgency = "urgent" THEN 2 ELSE 3 END', 'ASC')
      .addOrderBy('c.created_at', 'DESC')
      .getMany();
  }

  async assignCareRequest(
    id: string,
    dto: AssignCareRequestDto,
  ): Promise<PastoralCareRequest> {
    const request = await this.careRepo.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Không tìm thấy yêu cầu chăm sóc mục vụ này.');
    }

    request.assignedPastorId = dto.assignedPastorId;
    request.assignedPastorName = dto.assignedPastorName;
    request.scheduledAt = dto.scheduledAt || null;
    request.status = CareStatus.SCHEDULED;

    return this.careRepo.save(request);
  }

  async completeCareRequest(
    id: string,
    dto: CompleteCareRequestDto,
  ): Promise<PastoralCareRequest> {
    const request = await this.careRepo.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Không tìm thấy yêu cầu chăm sóc mục vụ.');
    }

    request.pastoralReport = dto.pastoralReport;
    request.status = CareStatus.COMPLETED;

    return this.careRepo.save(request);
  }

  async getHouseholds(campusId?: string, search?: string): Promise<Household[]> {
    const qb = this.householdRepo.createQueryBuilder('h');

    if (campusId && campusId !== 'all') {
      qb.andWhere('h.campus_id = :campusId', { campusId });
    }
    if (search) {
      qb.andWhere(
        '(LOWER(h.name) LIKE :s OR LOWER(h.city) LIKE :s OR LOWER(h.zipcode) LIKE :s OR LOWER(h.primary_phone) LIKE :s)',
        { s: `%${search.toLowerCase()}%` },
      );
    }

    return qb.orderBy('h.name', 'ASC').getMany();
  }

  async getHouseholdById(id: string): Promise<Household> {
    const household = await this.householdRepo.findOne({ where: { id } });
    if (!household) {
      throw new NotFoundException('Không tìm thấy thông tin hộ gia đình.');
    }
    return household;
  }

  async createHousehold(dto: CreateHouseholdDto): Promise<Household> {
    const household = this.householdRepo.create({
      name: dto.name,
      campusId: dto.campusId || 'Dallas Main Campus',
      primaryPhone: dto.primaryPhone,
      addressLine1: dto.addressLine1,
      city: dto.city,
      state: dto.state,
      zipcode: dto.zipcode,
      weddingAnniversary: dto.weddingAnniversary || null,
      members: dto.members || [],
      notes: dto.notes || null,
    });

    return this.householdRepo.save(household);
  }

  async updateHousehold(id: string, dto: Partial<CreateHouseholdDto>): Promise<Household> {
    const household = await this.getHouseholdById(id);
    Object.assign(household, dto);
    return this.householdRepo.save(household);
  }

  async getPastoralOverview(campusId?: string) {
    const qb = this.careRepo.createQueryBuilder('c');
    if (campusId && campusId !== 'all') {
      qb.andWhere('c.campus_id = :campusId', { campusId });
    }
    const all = await qb.getMany();

    const householdQb = this.householdRepo.createQueryBuilder('h');
    if (campusId && campusId !== 'all') {
      householdQb.andWhere('h.campus_id = :campusId', { campusId });
    }
    const totalHouseholds = await householdQb.getCount();

    let pendingCount = 0;
    let emergencyCount = 0;
    let scheduledCount = 0;
    let completedCount = 0;

    for (const r of all) {
      if (r.status === CareStatus.PENDING) pendingCount++;
      if (r.urgency === CareUrgency.EMERGENCY && r.status !== CareStatus.COMPLETED) {
        emergencyCount++;
      }
      if (r.status === CareStatus.SCHEDULED) scheduledCount++;
      if (r.status === CareStatus.COMPLETED) completedCount++;
    }

    return {
      totalRequests: all.length,
      pendingCount,
      emergencyCount,
      scheduledCount,
      completedCount,
      totalHouseholds,
    };
  }
}
