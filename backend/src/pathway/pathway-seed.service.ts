import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import {
  BaptismStatus,
  STAGE_DETAILS,
  SpiritualStage,
} from './enums/pathway.enums.js';
import { SpiritualProfile } from './entities/spiritual-profile.entity.js';

@Injectable()
export class PathwaySeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PathwaySeedService.name);

  constructor(
    @InjectRepository(SpiritualProfile)
    private readonly profileRepo: Repository<SpiritualProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.profileRepo.count();
      if (count > 0) return;

      this.logger.log('Khởi tạo dữ liệu mẫu cho Hành Trình Đức Tin & Cột Mốc Báp-têm...');

      const users = await this.userRepo.find();
      if (users.length === 0) return;

      for (const u of users) {
        if (u.role === Role.Admin) {
          const profile = this.profileRepo.create({
            userId: u.id,
            currentStage: SpiritualStage.MINISTRY_LEADER,
            baptismStatus: BaptismStatus.BAPTIZED,
            salvationDate: '2010-05-15',
            baptismDate: '2010-08-20',
            baptismClassCompletedAt: '2010-08-10',
            baptizedBy: 'Mục Sư Quản Nhiệm Tiền Nhiệm',
            communionEligible: true,
            mentorName: 'Mục Sư Trưởng Dallas',
            campusId: u.campusId || 'Dallas Main Campus',
            milestoneHistory: [
              {
                stage: SpiritualStage.NEW_BELIEVER,
                title: STAGE_DETAILS[SpiritualStage.NEW_BELIEVER].titleVi,
                achievedAt: '2010-05-15T00:00:00.000Z',
                notes: 'Tiếp nhận Chúa Jesus trong kỳ bồi linh mùa hè',
              },
              {
                stage: SpiritualStage.BAPTIZED,
                title: STAGE_DETAILS[SpiritualStage.BAPTIZED].titleVi,
                achievedAt: '2010-08-20T00:00:00.000Z',
                notes: 'Nhận phép Báp-têm dìm mình trong nước',
                verifiedBy: 'Hội Thánh Ân Điển',
              },
              {
                stage: SpiritualStage.MINISTRY_LEADER,
                title: STAGE_DETAILS[SpiritualStage.MINISTRY_LEADER].titleVi,
                achievedAt: '2018-01-01T00:00:00.000Z',
                notes: 'Được tấn phong Mục Sư Quản Nhiệm lãnh đạo bầy chiên',
              },
            ],
          });
          await this.profileRepo.save(profile);
        } else if (u.role === Role.User) {
          const profile = this.profileRepo.create({
            userId: u.id,
            currentStage: SpiritualStage.MINISTRY_LEADER,
            baptismStatus: BaptismStatus.BAPTIZED,
            salvationDate: '2016-03-27',
            baptismDate: '2016-06-12',
            communionEligible: true,
            campusId: u.campusId || 'Dallas Main Campus',
            milestoneHistory: [
              {
                stage: SpiritualStage.NEW_BELIEVER,
                title: STAGE_DETAILS[SpiritualStage.NEW_BELIEVER].titleVi,
                achievedAt: '2016-03-27T00:00:00.000Z',
              },
              {
                stage: SpiritualStage.BAPTIZED,
                title: STAGE_DETAILS[SpiritualStage.BAPTIZED].titleVi,
                achievedAt: '2016-06-12T00:00:00.000Z',
              },
              {
                stage: SpiritualStage.MINISTRY_LEADER,
                title: STAGE_DETAILS[SpiritualStage.MINISTRY_LEADER].titleVi,
                achievedAt: '2021-09-01T00:00:00.000Z',
                notes: 'Nhận chức vụ Trưởng Ban Thanh Niên / Giáo viên Trường Chúa Nhật',
              },
            ],
          });
          await this.profileRepo.save(profile);
        } else {
          // Regular member
          const profile = this.profileRepo.create({
            userId: u.id,
            currentStage: SpiritualStage.BAPTISM_CANDIDATE,
            baptismStatus: BaptismStatus.ENROLLED_CLASS,
            salvationDate: '2025-12-25',
            salvationTestimony:
              'Tôi đã cảm nhận tình yêu của Chúa trong đêm Giáng Sinh và quyết định mời Chúa Jesus làm Chủ cuộc đời tôi.',
            communionEligible: false,
            mentorName: 'Chấp sự John Nguyen',
            campusId: u.campusId || 'Dallas Main Campus',
            milestoneHistory: [
              {
                stage: SpiritualStage.NEW_BELIEVER,
                title: STAGE_DETAILS[SpiritualStage.NEW_BELIEVER].titleVi,
                achievedAt: '2025-12-25T00:00:00.000Z',
                notes: 'Tiếp nhận Chúa đêm Giáng Sinh',
              },
              {
                stage: SpiritualStage.BAPTISM_CANDIDATE,
                title: STAGE_DETAILS[SpiritualStage.BAPTISM_CANDIDATE].titleVi,
                achievedAt: '2026-02-01T00:00:00.000Z',
                notes: 'Đăng ký tham dự lớp Giáo lý Báp-têm Phục Sinh',
              },
            ],
          });
          await this.profileRepo.save(profile);
        }
      }
    } catch (err) {
      this.logger.warn(`Không thể khởi tạo seed pathway: ${(err as Error).message}`);
    }
  }
}
