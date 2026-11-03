import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerCategory, PrayerStatus } from './enums/prayer.enums.js';
import { PrayerRequest } from './entities/prayer-request.entity.js';

@Injectable()
export class PrayersSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PrayersSeedService.name);

  constructor(
    @InjectRepository(PrayerRequest)
    private readonly prayerRepo: Repository<PrayerRequest>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.prayerRepo.count();
      if (count > 0) {
        return;
      }

      this.logger.log('Khởi tạo dữ liệu mẫu cho Tường Cầu Thay & Lời Tạ Ơn...');

      await this.prayerRepo.save([
        this.prayerRepo.create({
          title: 'Cầu nguyện cho ca mổ của Bác David Tran vào thứ Ba tuần tới',
          content:
            'Kính xin Mục sư và Hội Thánh cùng hiệp ý cầu thay cho Bác David sẽ trải qua ca phẫu thuật tim tại bệnh viện Baylor Scott & White (Plano). Xin Chúa ban sự khôn ngoan cho ê-kíp bác sĩ và sự bình an cho gia đình.',
          authorName: 'Gia đình Bác David Tran (Plano, TX)',
          category: PrayerCategory.Healing,
          isConfidential: false,
          isAnonymous: false,
          isAnswered: false,
          prayerCount: 18,
          status: PrayerStatus.Approved,
        }),
        this.prayerRepo.create({
          title: 'Cầu nguyện cho các cháu thanh niên gìn giữ đức tin tại trường đại học',
          content:
            'Xin Chúa gìn giữ các bạn trẻ thế hệ thứ 2 tại UT Dallas và Texas A&M luôn đứng vững trước các trào lưu thế tục, yêu mến Lời Chúa và dạn dĩ làm chứng cho Chúa Jesus giữa bạn bè.',
          authorName: 'Ban Phụ Huynh Lớp Thiếu Nhi & Thanh Niên',
          category: PrayerCategory.Family,
          isConfidential: false,
          isAnonymous: false,
          isAnswered: false,
          prayerCount: 24,
          status: PrayerStatus.Approved,
        }),
        this.prayerRepo.create({
          title: 'Tạ ơn Chúa! Em Timmy Nguyen đã nhận được việc làm và bình an sau tai nạn',
          content:
            'Tháng trước con có xin Hội Thánh cầu thay khi cháu Timmy tìm việc làm tại Dallas sau khi tốt nghiệp. Tạ ơn Chúa Ngài đã mở đường vượt quá điều gia đình cầu xin!',
          authorName: 'Chị Sarah Nguyen (Dallas, TX)',
          category: PrayerCategory.Thanksgiving,
          isConfidential: false,
          isAnonymous: false,
          isAnswered: true,
          praiseReport:
            'Chúa thật là Đấng thành tín! Cháu Timmy đã được nhận vào làm kỹ sư phần mềm tại công ty công nghệ ở Irving. Gia đình xin dâng lời tạ ơn Chúa và cảm ơn Hội Thánh đã bền lòng hiệp nguyện!',
          prayerCount: 32,
          status: PrayerStatus.Approved,
        }),
        this.prayerRepo.create({
          title: 'Cầu nguyện cho chuyến truyền giáo mùa hè của Ban Truyền Giáo',
          content:
            'Xin hiệp ý cầu nguyện cho các giáo sĩ và nhân sự trong chuyến đi thăm viếng và truyền giảng Tin Lành cho đồng bào tại các tiểu bang miền Trung Tây Hoa Kỳ.',
          authorName: 'Mục Sư Quản Nhiệm & Ban Truyền Giáo',
          category: PrayerCategory.Ministry,
          isConfidential: false,
          isAnonymous: false,
          isAnswered: false,
          prayerCount: 15,
          status: PrayerStatus.Approved,
        }),
      ]);

      this.logger.log('Đã tạo thành công 4 lời cầu thay và tạ ơn mẫu trên Tường Hiệp Nguyện.');
    } catch (error) {
      this.logger.warn(`Lỗi khởi tạo seed cầu thay: ${(error as Error).message}`);
    }
  }
}
