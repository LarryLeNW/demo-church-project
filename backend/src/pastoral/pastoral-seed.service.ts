import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../common/enums/role.enum.js';
import {
  CareStatus,
  CareType,
  CareUrgency,
} from './enums/pastoral.enums.js';
import { Household } from './entities/household.entity.js';
import { PastoralCareRequest } from './entities/pastoral-care-request.entity.js';

@Injectable()
export class PastoralSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PastoralSeedService.name);

  constructor(
    @InjectRepository(Household)
    private readonly householdRepo: Repository<Household>,
    @InjectRepository(PastoralCareRequest)
    private readonly careRepo: Repository<PastoralCareRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.householdRepo.count();
      if (count > 0) return;

      this.logger.log('Khởi tạo dữ liệu mẫu cho Danh Bạ Gia Đình & Chăm Sóc Mục Vụ...');

      const pastor = await this.userRepo.findOne({
        where: [{ role: Role.SeniorPastor }, { role: Role.Admin }],
      });
      const pastorId = pastor ? pastor.id : null;
      const pastorName = pastor ? pastor.fullName : 'Mục Sư Quản Nhiệm';

      const householdsData: Partial<Household>[] = [
        {
          name: 'Gia đình Bác David & Mary Tran',
          campusId: 'Dallas Main Campus',
          primaryPhone: '(469) 555-0182',
          addressLine1: '3821 Legacy Dr',
          city: 'Plano',
          state: 'TX',
          zipcode: '75024',
          weddingAnniversary: '1988-06-18',
          members: [
            { fullName: 'David Tran', roleInFamily: 'head', birthday: '1962-03-12' },
            { fullName: 'Mary Tran', roleInFamily: 'spouse', birthday: '1965-09-24' },
            { fullName: 'Daniel Tran', roleInFamily: 'child', birthday: '1995-11-04' },
          ],
          notes: 'Gia đình trung tín phục vụ trong ban tiếp tân và nhóm tế bào Plano.',
        },
        {
          name: 'Gia đình Anh Chị Michael & Grace Nguyen',
          campusId: 'Dallas Main Campus',
          primaryPhone: '(214) 555-0391',
          addressLine1: '512 Spring Creek Pkwy',
          city: 'Plano',
          state: 'TX',
          zipcode: '75023',
          weddingAnniversary: '2019-10-12',
          members: [
            { fullName: 'Michael Nguyen', roleInFamily: 'head', birthday: '1990-05-14' },
            { fullName: 'Grace Nguyen', roleInFamily: 'spouse', birthday: '1992-08-20' },
            { fullName: 'Joshua Nguyen', roleInFamily: 'child', birthday: '2023-04-10' },
          ],
          notes: 'Gia đình trẻ tham gia lớp Trường Chúa Nhật và Ban Âm Nhạc.',
        },
        {
          name: 'Gia đình Bác Timothy & Sarah Le',
          campusId: 'Houston Campus',
          primaryPhone: '(832) 555-0941',
          addressLine1: '10920 Bellaire Blvd',
          city: 'Houston',
          state: 'TX',
          zipcode: '77072',
          weddingAnniversary: '1992-04-25',
          members: [
            { fullName: 'Timothy Le', roleInFamily: 'head', birthday: '1968-01-30' },
            { fullName: 'Sarah Le', roleInFamily: 'spouse', birthday: '1970-12-05' },
          ],
          notes: 'Chấp sự phụ trách điểm nhóm sinh hoạt Houston.',
        },
      ];

      const savedHouseholds = await this.householdRepo.save(
        householdsData.map((h) => this.householdRepo.create(h)),
      );

      const allUsers = await this.userRepo.find();
      const primaryUser = allUsers.length > 0 ? allUsers[0] : null;

      if (primaryUser) {
        const careRequestsData: Partial<PastoralCareRequest>[] = [
          {
            userId: primaryUser.id,
            householdId: savedHouseholds[0]?.id || null,
            requestType: CareType.HOSPITAL_VISIT,
            urgency: CareUrgency.EMERGENCY,
            patientOrMemberName: 'Bác David Tran',
            hospitalOrAddress: 'Baylor Scott & White Medical Center (Plano, TX) - Room 412',
            contactPhone: '(469) 555-0182',
            description:
              'Bác David vừa trải qua ca phẫu thuật tim chiều nay. Bác sĩ yêu cầu theo dõi tích cực tại ICU. Kính xin Mục sư đến xức dầu và cầu nguyện bình an cho Bác và gia đình.',
            campusId: 'Dallas Main Campus',
            status: CareStatus.SCHEDULED,
            assignedPastorId: pastorId,
            assignedPastorName: pastorName,
            scheduledAt: '2026-11-03T10:00:00',
            pastoralReport: null,
          },
          {
            userId: primaryUser.id,
            householdId: savedHouseholds[1]?.id || null,
            requestType: CareType.BABY_DEDICATION,
            urgency: CareUrgency.ROUTINE,
            patientOrMemberName: 'Cháu Joshua Nguyen (con Anh Michael & Chị Grace)',
            hospitalOrAddress: 'Sanctuary Hội Thánh Dallas',
            contactPhone: '(214) 555-0391',
            description:
              'Gia đình xin đăng ký lễ Dâng Con Trẻ cho cháu Joshua (3 tuổi) vào Chúa Nhật Lễ Tạ Ơn sắp tới để kết ước nuôi con trong Lời Chúa.',
            campusId: 'Dallas Main Campus',
            status: CareStatus.SCHEDULED,
            assignedPastorId: pastorId,
            assignedPastorName: pastorName,
            scheduledAt: '2026-11-29T10:30:00',
            pastoralReport: null,
          },
        ];

        await this.careRepo.save(
          careRequestsData.map((c) => this.careRepo.create(c)),
        );
      }
    } catch (err) {
      this.logger.warn(`Không thể khởi tạo seed pastoral: ${(err as Error).message}`);
    }
  }
}
