import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventCategory } from './enums/event.enums.js';
import { ChurchEvent } from './entities/church-event.entity.js';

@Injectable()
export class EventsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventsSeedService.name);

  constructor(
    @InjectRepository(ChurchEvent)
    private readonly eventRepo: Repository<ChurchEvent>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.eventRepo.count();
      if (count > 0) return;

      this.logger.log('Khởi tạo dữ liệu mẫu cho Lịch Sự Kiện Hội Thánh & RSVP...');

      const eventsData: Partial<ChurchEvent>[] = [
        {
          title: 'Đêm Thánh Nhạc Tạ Ơn & Tiệc Gà Tây Thông Công',
          titleEn: 'Thanksgiving Celebration & Fellowship Banquet',
          slug: 'dem-thanh-nhac-ta-on-tiec-ga-tay-2026',
          description:
            'Chương trình thờ phượng tạ ơn Chúa vì một năm ban ơn dư dật trên từng gia đình trong Hội Thánh. Sau giờ thờ phượng là tiệc thông công gà tây truyền thống tại Fellowship Hall.',
          category: EventCategory.FELLOWSHIP,
          campusId: 'Dallas Main Campus',
          startDate: '2026-11-26T18:00:00',
          endDate: '2026-11-26T21:30:00',
          location: 'Sanctuary & Fellowship Hall (Dallas Main Campus)',
          bannerUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
          requiresRegistration: true,
          maxAttendees: 250,
          registeredCount: 84,
          registrationDeadline: '2026-11-24T23:59:59',
          cost: 0,
          isPublished: true,
        },
        {
          title: 'Đại Lễ Thắp Nến Giáng Sinh (Christmas Candlelight Service)',
          titleEn: 'Christmas Eve Candlelight Service',
          slug: 'dai-le-thap-nen-giang-sinh-2026',
          description:
            'Đêm thắp nến tôn vinh Con Trời Giáng Sinh. Ca đoàn tổng hợp biểu diễn các bài thánh ca cổ điển, truyền giảng sứ điệp hy vọng cho thân hữu.',
          category: EventCategory.WORSHIP,
          campusId: 'Dallas Main Campus',
          startDate: '2026-12-24T19:00:00',
          endDate: '2026-12-24T21:00:00',
          location: 'Đại Thánh Đường Hội Thánh Dallas (Dallas Sanctuary)',
          bannerUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80',
          requiresRegistration: true,
          maxAttendees: 400,
          registeredCount: 156,
          registrationDeadline: '2026-12-23T23:59:59',
          cost: 0,
          isPublished: true,
        },
        {
          title: 'Khóa Bồi Linh Hôn Nhân Cơ Đốc & Gia Đình Trẻ',
          titleEn: 'Christian Marriage & Young Couples Retreat',
          slug: 'khoa-boi-linh-hon-nhan-co-doc-2027',
          description:
            'Chuyên đề xây dựng hôn nhân vững bền theo tiêu chuẩn Kinh Thánh: Giao tiếp yêu thương, tài chính gia đình và nuôi dạy con cái trong đức tin.',
          category: EventCategory.CAMP_RETREAT,
          campusId: 'Houston Campus',
          startDate: '2027-02-13T09:00:00',
          endDate: '2027-02-14T16:00:00',
          location: 'The Woodlands Resort & Conference Center (Houston, TX)',
          bannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          requiresRegistration: true,
          maxAttendees: 60,
          registeredCount: 22,
          registrationDeadline: '2027-02-05T23:59:59',
          cost: 75,
          isPublished: true,
        },
        {
          title: 'Trại Hè Thánh Kinh Thiếu Nhi VBS 2027',
          titleEn: 'Vacation Bible School (VBS 2027) - Camp Adventure',
          slug: 'trai-he-thanh-kinh-thieu-nhi-vbs-2027',
          description:
            'Chương trình Thánh Kinh Mùa Hè sôi động dành cho các bé từ 4 đến 12 tuổi: Học Lời Chúa, đóng kịch, thủ công mỹ thuật và hoạt động thể thao ngoài trời.',
          category: EventCategory.FAMILY_KIDS,
          campusId: 'Dallas Main Campus',
          startDate: '2027-06-18T08:30:00',
          endDate: '2027-06-20T17:00:00',
          location: 'Cơ Sở Trường Chúa Nhật Hội Thánh Dallas & Sân Vận Động',
          bannerUrl: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1200&q=80',
          requiresRegistration: true,
          maxAttendees: 120,
          registeredCount: 45,
          registrationDeadline: '2027-06-10T23:59:59',
          cost: 25,
          isPublished: true,
        },
      ];

      await this.eventRepo.save(eventsData.map((ed) => this.eventRepo.create(ed)));
    } catch (err) {
      this.logger.warn(`Không thể khởi tạo seed events: ${(err as Error).message}`);
    }
  }
}
