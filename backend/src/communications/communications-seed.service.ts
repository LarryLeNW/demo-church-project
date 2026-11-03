import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { ChurchBulletin } from './entities/church-bulletin.entity.js';
import { ChurchCommunication } from './entities/church-communication.entity.js';
import {
  CommunicationChannel,
  CommunicationType,
  MessageStatus,
  TargetAudience,
} from './enums/communication.enums.js';

@Injectable()
export class CommunicationsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CommunicationsSeedService.name);

  constructor(
    @InjectRepository(ChurchBulletin)
    private readonly bulletinRepo: Repository<ChurchBulletin>,
    @InjectRepository(ChurchCommunication)
    private readonly commRepo: Repository<ChurchCommunication>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedBulletin();
      await this.seedCommunication();
    } catch (err) {
      this.logger.warn(`Lỗi khởi tạo Communications Seed: ${(err as Error).message}`);
    }
  }

  private async seedBulletin() {
    const count = await this.bulletinRepo.count();
    if (count > 0) return;

    const bulletin = this.bulletinRepo.create({
      title: 'Bản Tin Thờ Phượng Chúa Nhật — Soli Deo Gloria',
      bulletinDate: '2026-03-15',
      themeScripture: 'Giăng 15:5 — "Ta là gốc nho, các ngươi là nhánh. Ai cứ ở trong Ta và Ta trong người ấy thì sinh ra nhiều quả."',
      sermonTitle: 'Sự Kết Hiệp Sống Động Cùng Đấng Christ',
      preacherName: 'Rev. Barnabas Nguyen (Mục Sư Quản Nhiệm)',
      orderOfService: [
        {
          order: 1,
          segment: 'Nhạc Dạo & Chuẩn Bị Lòng Thờ Phượng (Prelude)',
          leaderOrMinister: 'Ban Thờ Phượng Grace Worship',
        },
        {
          order: 2,
          segment: 'Thánh Ca Ngợi Khen & Tôn Vinh (Praise & Worship)',
          leaderOrMinister: 'Truyền đạo David Le & Ban Nhạc',
        },
        {
          order: 3,
          segment: 'Cầu Nguyện Khai Lễ & Tạ Ơn (Invocation Prayer)',
          leaderOrMinister: 'Chấp sự John Tran',
        },
        {
          order: 4,
          segment: 'Đọc Lời Chúa Đối Đáp (Responsive Scripture Reading)',
          leaderOrMinister: 'Hội Chúng Hiệp Nhất (Thi Thiên 23)',
        },
        {
          order: 5,
          segment: 'Dâng Hiến Tạ Ơn & Báo Cáo Mục Vụ (Offertory & Tithes)',
          leaderOrMinister: 'Ban Trị Sự & Thủ Quỹ Sarah Tran',
        },
        {
          order: 6,
          segment: 'Giảng Luận Lời Chúa (Sermon Proclamation)',
          leaderOrMinister: 'Mục Sư Barnabas Nguyen',
        },
        {
          order: 7,
          segment: 'Cầu Nguyện Đáp Ứng & Phước Lành (Benediction)',
          leaderOrMinister: 'Mục Sư Quản Nhiệm',
        },
      ],
      announcements: [
        {
          title: 'Lớp Học Kinh Thánh Môn Đồ Hóa Mùa Xuân',
          category: 'Christian Education',
          content: 'Khai giảng lớp "Nền Tảng Môn Đồ Khởi Đầu" vào mỗi sáng Chúa Nhật lúc 09:15 tại Phòng 204 và trực tuyến.',
          dateOrDeadline: 'Chúa Nhật, 09:15 AM',
          contactPerson: 'Thầy David Le',
        },
        {
          title: 'Ngày Thăm Viếng & Cầu Nguyện Ban Bác Ái',
          category: 'Pastoral Care',
          content: 'Thăm viếng các tín hữu cao niên và gia đình mới sang định cư tại khu vực Dallas - Fort Worth.',
          dateOrDeadline: 'Thứ Bảy, 10:00 AM',
          contactPerson: 'Bà Sarah Nguyen',
        },
        {
          title: 'Thông Báo Về Biên Nhận Thuế Dâng Hiến IRS 501(c)(3)',
          category: 'Administration',
          content: 'Tín hữu có thể tải chứng từ khấu trừ thuế năm trực tiếp từ ứng dụng Hội Thánh tại mục Dâng Hiến.',
          dateOrDeadline: 'Có sẵn trên App',
          contactPerson: 'Văn phòng Hội Thánh',
        },
      ],
      prayerFocus: 'Hiệp ý cầu nguyện cho sự phục hưng của các gia đình trẻ, con em Lớp Thiếu Nhi biết kính sợ Chúa và công tác truyền giáo tại các tiểu bang miền Nam Hoa Kỳ.',
      financialUpdate: 'Dâng hiến Chúa Nhật tuần qua: $4,850.00 | Quỹ Truyền Giáo: $1,200.00. Tạ ơn Chúa vì sự rộng rãi của con dân Ngài.',
      isPublished: true,
    });

    await this.bulletinRepo.save(bulletin);
    this.logger.log('Đã khởi tạo bản tin tuần mẫu Soli Deo Gloria.');
  }

  private async seedCommunication() {
    const count = await this.commRepo.count();
    if (count > 0) return;

    const pastor = await this.userRepo.findOne({
      where: { role: Role.SeniorPastor },
    });

    if (!pastor) return;

    const sampleComm = this.commRepo.create({
      senderId: pastor.id,
      channel: CommunicationChannel.SMS,
      type: CommunicationType.EmergencyAlert,
      targetAudience: TargetAudience.AllMembers,
      title: 'CẢNH BÁO THỜI TIẾT ĐÓNG BĂNG TẠI DALLAS - BUỔI NHÓM TRỰC TUYẾN',
      content: 'Kính gửi quý Hội Thánh, do bão tuyết và đường sá đóng băng nguy hiểm tại DFW, buổi nhóm Thứ Tư sẽ chuyển hoàn toàn sang trực tuyến qua Zoom lúc 19:30. Xin quý con cái Chúa ở nhà giữ ấm an toàn!',
      recipientCount: 142,
      status: MessageStatus.Sent,
      sentAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      metadata: {
        provider: 'Twilio SMS Gateway',
        segmentsCount: 2,
        deliveredRate: '98.6%',
      },
    });

    await this.commRepo.save(sampleComm);
    this.logger.log('Đã khởi tạo thông điệp SMS Twilio mẫu.');
  }
}
