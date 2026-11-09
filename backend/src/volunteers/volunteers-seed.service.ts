import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../common/enums/role.enum.js';
import {
  BackgroundCheckStatus,
  RosterStatus,
  VolunteerStatus,
} from './enums/volunteer.enums.js';
import { MinistryTeam } from './entities/ministry-team.entity.js';
import { VolunteerMember } from './entities/volunteer-member.entity.js';
import { SundayRoster } from './entities/sunday-roster.entity.js';

@Injectable()
export class VolunteersSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(VolunteersSeedService.name);

  constructor(
    @InjectRepository(MinistryTeam)
    private readonly teamRepo: Repository<MinistryTeam>,
    @InjectRepository(VolunteerMember)
    private readonly memberRepo: Repository<VolunteerMember>,
    @InjectRepository(SundayRoster)
    private readonly rosterRepo: Repository<SundayRoster>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.teamRepo.count();
      if (count > 0) return;

      this.logger.log('Khởi tạo dữ liệu mẫu cho Ban Phụng Vụ & Lịch Trực Chúa Nhật...');

      const pastor = await this.userRepo.findOne({
        where: [{ role: Role.SeniorPastor }, { role: Role.Admin }],
      });
      const leaderId = pastor ? pastor.id : null;

      const teamsData: Partial<MinistryTeam>[] = [
        {
          name: 'Ban Thờ Phượng & Ca Đoàn',
          nameEn: 'Worship & Music Ministry',
          leaderId,
          campusId: 'Dallas Main Campus',
          description: 'Dẫn dắt Hội Thánh ngợi khen tôn vinh Chúa qua các giai điệu thánh linh.',
          requiredClearance: false,
          color: 'indigo',
          iconName: 'Music',
        },
        {
          name: 'Kỹ Thuật Âm Thanh, Media & Livestream',
          nameEn: 'A/V Media & Broadcast Team',
          leaderId,
          campusId: 'Dallas Main Campus',
          description: 'Điều khiển mixer âm thanh, máy chiếu ProPresenter và phát trực tiếp bài giảng cho tín hữu xa gần.',
          requiredClearance: false,
          color: 'amber',
          iconName: 'Tv',
        },
        {
          name: 'Ban Tiếp Tân & Chào Đón Thân Hữu',
          nameEn: 'Ushers & Greeters Ministry',
          leaderId,
          campusId: 'Dallas Main Campus',
          description: 'Nụ cười chào đón đầu tiên tại cửa thánh đường, hướng dẫn chỗ ngồi và thu tiền dâng hiến.',
          requiredClearance: false,
          color: 'emerald',
          iconName: 'Smile',
        },
        {
          name: 'Giáo Viên Trường Chúa Nhật (Sunday School)',
          nameEn: 'Children & Youth Sunday School Teachers',
          leaderId,
          campusId: 'Dallas Main Campus',
          description: 'Dạy Lời Chúa và chăm sóc các cháu thiếu nhi từ Ấu nhi đến Thiếu niên. Yêu cầu kiểm tra an toàn lý lịch (Child Safety).',
          requiredClearance: true,
          color: 'rose',
          iconName: 'ShieldCheck',
        },
        {
          name: 'Ban Ẩm Thực Thông Công (Fellowship Kitchen)',
          nameEn: 'Hospitality & Fellowship Ministry',
          leaderId,
          campusId: 'Dallas Main Campus',
          description: 'Chuẩn bị cà phê, điểm tâm sáng và bữa ăn trưa thông công ấm cúng sau giờ thờ phượng.',
          requiredClearance: false,
          color: 'purple',
          iconName: 'Utensils',
        },
      ];

      const savedTeams = await this.teamRepo.save(
        teamsData.map((td) => this.teamRepo.create(td)),
      );

      const allUsers = await this.userRepo.find();
      if (allUsers.length > 0 && savedTeams.length > 0) {
        const worshipTeam = savedTeams[0];
        const mediaTeam = savedTeams[1];
        const usherTeam = savedTeams[2];
        const kidsTeam = savedTeams[3];

        // Add users to teams
        for (const user of allUsers) {
          await this.memberRepo.save(
            this.memberRepo.create({
              teamId: worshipTeam.id,
              userId: user.id,
              roleInTeam: 'Hát Ca Đoàn (Vocalist)',
              status: VolunteerStatus.ACTIVE,
              backgroundCheckStatus: BackgroundCheckStatus.NOT_REQUIRED,
            }),
          );

          if (user.role === Role.Admin) {
            await this.memberRepo.save(
              this.memberRepo.create({
                teamId: kidsTeam.id,
                userId: user.id,
                roleInTeam: 'Giáo viên phụ trách',
                status: VolunteerStatus.ACTIVE,
                backgroundCheckStatus: BackgroundCheckStatus.APPROVED,
                backgroundCheckApprovedAt: '2026-01-15',
              }),
            );
          }
        }

        // Seed upcoming Sunday rosters (e.g. 2026-11-08)
        const primaryUser = allUsers[0];
        const secondUser = allUsers.length > 1 ? allUsers[1] : primaryUser;

        const rosterItems = [
          this.rosterRepo.create({
            serviceDate: '2026-11-08',
            serviceTitle: 'Lễ Thờ Phượng Chúa Nhật (10:00 AM)',
            campusId: 'Dallas Main Campus',
            teamId: worshipTeam.id,
            userId: primaryUser.id,
            roleTitle: 'Hát Chính (Lead Vocal)',
            status: RosterStatus.CONFIRMED,
            notes: 'Tổng duyệt âm thanh lúc 8:45 AM',
          }),
          this.rosterRepo.create({
            serviceDate: '2026-11-08',
            serviceTitle: 'Lễ Thờ Phượng Chúa Nhật (10:00 AM)',
            campusId: 'Dallas Main Campus',
            teamId: mediaTeam.id,
            userId: secondUser.id,
            roleTitle: 'Kỹ Thuật Mixer Âm Thanh',
            status: RosterStatus.PENDING,
            notes: 'Kiểm tra pin micro không dây trước giờ nhóm',
          }),
          this.rosterRepo.create({
            serviceDate: '2026-11-08',
            serviceTitle: 'Lễ Thờ Phượng Chúa Nhật (10:00 AM)',
            campusId: 'Dallas Main Campus',
            teamId: usherTeam.id,
            userId: primaryUser.id,
            roleTitle: 'Đón Tiếp Cửa Chính (Greeter)',
            status: RosterStatus.PENDING,
            notes: 'Có mặt tại sảnh lúc 9:30 AM phát tờ bản tin',
          }),
        ];

        await this.rosterRepo.save(rosterItems);
      }
    } catch (err) {
      this.logger.warn(`Không thể khởi tạo seed volunteers: ${(err as Error).message}`);
    }
  }
}
