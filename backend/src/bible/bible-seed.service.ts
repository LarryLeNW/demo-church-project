import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiblePlan } from './entities/bible-plan.entity.js';
import { PlanDayReading } from './entities/plan-day-reading.entity.js';
import { PlanCategory } from './enums/bible.enums.js';

@Injectable()
export class BibleSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BibleSeedService.name);

  constructor(
    @InjectRepository(BiblePlan)
    private readonly planRepo: Repository<BiblePlan>,
    @InjectRepository(PlanDayReading)
    private readonly readingRepo: Repository<PlanDayReading>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.planRepo.count();
      if (count > 0) {
        return;
      }

      this.logger.log('Khởi tạo dữ liệu mẫu cho Lộ Trình Đọc Kinh Thánh Hằng Ngày...');

      // Plan 1: Kinh Thánh Trọn Năm
      const plan1 = await this.planRepo.save(
        this.planRepo.create({
          title: 'Kinh Thánh Trọn Năm (Bible in One Year)',
          slug: 'kinh-thanh-tron-nam',
          description:
            'Đọc trọn vẹn 66 sách Kinh Thánh trong 365 ngày: Mỗi ngày nuôi dưỡng tâm linh bằng một phần Cựu Ước, một phần Tân Ước và một Thi Thiên ngợi khen.',
          durationDays: 365,
          category: PlanCategory.OneYear,
          thumbnailUrl:
            'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
          isPublished: true,
        }),
      );

      await this.readingRepo.save([
        this.readingRepo.create({
          planId: plan1.id,
          dayNumber: 1,
          title: 'Ngày 1: Sự Sáng Tạo & Khởi Đầu Của Ơn Cứu Chuộc',
          passageOldTestament: 'Sáng Thế Ký 1-2',
          passageNewTestament: 'Ma-thi-ơ 1',
          passagePsalmProverbs: 'Thi Thiên 1:1-6',
          keyVerseText:
            'Ban đầu Đức Chúa Trời dựng nên trời đất. Vả, đất là vô hình và trống không, sự tối tăm ở trên mặt vực; Thần Đức Chúa Trời vận hành trên mặt nước. (Sáng Thế Ký 1:1-2)',
          reflectionPrompt:
            'Trật tự và vẻ đẹp của sự sáng tạo bày tỏ điều gì về quyền năng và tình yêu của Đức Chúa Trời dành cho bạn hôm nay?',
        }),
        this.readingRepo.create({
          planId: plan1.id,
          dayNumber: 2,
          title: 'Ngày 2: Sự Sa Ngã & Lời Hứa Về Đấng Cứu Thế',
          passageOldTestament: 'Sáng Thế Ký 3-4',
          passageNewTestament: 'Ma-thi-ơ 2',
          passagePsalmProverbs: 'Thi Thiên 2:1-12',
          keyVerseText:
            'Ta sẽ làm cho mầy cùng người nữ, dòng dõi mầy cùng dòng dõi người, nghịch thù nhau. Người sẽ giày đạp đầu mầy, còn mầy sẽ cắn gót chân người. (Sáng Thế Ký 3:15)',
          reflectionPrompt:
            'Trước sự cám dỗ trong đời sống hiện đại tại Mỹ, bạn nương cậy vào thẩm quyền của Lời Chúa như thế nào để đắc thắng?',
        }),
        this.readingRepo.create({
          planId: plan1.id,
          dayNumber: 3,
          title: 'Ngày 3: Chiếc Tàu Cứu Rỗi & Lòng Trung Tín Của Nô-ê',
          passageOldTestament: 'Sáng Thế Ký 5-6',
          passageNewTestament: 'Ma-thi-ơ 3',
          passagePsalmProverbs: 'Thi Thiên 3:1-8',
          keyVerseText:
            'Nhưng Nô-ê được ơn trước mặt Đức Giê-hô-va. Nô-ê trong đời mình là một người công chính và trọn vẹn, đồng đi cùng Đức Chúa Trời. (Sáng Thế Ký 6:8-9)',
          reflectionPrompt:
            'Làm thế nào để gia đình bạn luôn "đồng đi cùng Đức Chúa Trời" giữa một xã hội đầy dẫy những xao lãng?',
        }),
      ]);

      // Plan 2: Bốn Sách Phúc Âm (The Gospels in 90 Days)
      const plan2 = await this.planRepo.save(
        this.planRepo.create({
          title: 'Bốn Sách Phúc Âm (The Gospels in 90 Days)',
          slug: 'bon-sach-phuc-am-90-ngay',
          description:
            'Chiêm ngưỡng chức vụ, phép lạ, sự chết và sự sống lại vinh hiển của Chúa Cứu Thế Jesus qua 4 sách Tin Lành: Ma-thi-ơ, Mác, Lu-ca và Giăng.',
          durationDays: 90,
          category: PlanCategory.Gospels,
          thumbnailUrl:
            'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
          isPublished: true,
        }),
      );

      await this.readingRepo.save([
        this.readingRepo.create({
          planId: plan2.id,
          dayNumber: 1,
          title: 'Ngày 1: Gia Phả & Giáng Sinh Của Vua Bình An',
          passageOldTestament: null,
          passageNewTestament: 'Ma-thi-ơ 1:1-25',
          passagePsalmProverbs: null,
          keyVerseText:
            'Nàng sẽ sinh một con trai, ngươi hãy đặt tên là Jêsus, vì chính Con ấy sẽ cứu dân mình ra khỏi tội. (Ma-thi-ơ 1:21)',
          reflectionPrompt:
            'Danh hiệu "Em-ma-nu-ên" (Đức Chúa Trời ở cùng chúng ta) mang lại niềm an ủi nào cho tấm lòng bạn sáng nay?',
        }),
        this.readingRepo.create({
          planId: plan2.id,
          dayNumber: 2,
          title: 'Ngày 2: Sự Thờ Phượng Của Các Bác Sĩ Đông Phương',
          passageOldTestament: null,
          passageNewTestament: 'Ma-thi-ơ 2:1-23',
          passagePsalmProverbs: null,
          keyVerseText:
            'Khi vào nhà, thấy Con Trẻ cùng Ma-ri, mẹ Ngài, thì sấp mình xuống mà thờ lạy Ngài; rồi mở báu tráp ra, dâng cho Ngài những lễ vật: vàng, nhũ hương và một dược. (Ma-thi-ơ 2:11)',
          reflectionPrompt:
            'Bạn dâng điều quý giá nhất nào trong thì giờ và tài năng của mình lên cho Chúa Jesus?',
        }),
      ]);

      // Plan 3: Thi Thiên & Châm Ngôn (Psalms & Proverbs in 30 Days)
      const plan3 = await this.planRepo.save(
        this.planRepo.create({
          title: 'Thi Thiên & Châm Ngôn (Psalms & Proverbs in 30 Days)',
          slug: 'thi-thien-cham-ngon-30-ngay',
          description:
            'Lộ trình 30 ngày tưới mát tâm hồn: Khởi đầu ngày mới bằng lời ngợi khen trong Thi Thiên và những lời khôn ngoan xử thế trong Châm Ngôn.',
          durationDays: 30,
          category: PlanCategory.Wisdom,
          thumbnailUrl:
            'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80',
          isPublished: true,
        }),
      );

      await this.readingRepo.save([
        this.readingRepo.create({
          planId: plan3.id,
          dayNumber: 1,
          title: 'Ngày 1: Phước Cho Người Công Chính & Khởi Đầu Của Sự Khôn Ngoan',
          passageOldTestament: null,
          passageNewTestament: null,
          passagePsalmProverbs: 'Thi Thiên 1-2 & Châm Ngôn 1:1-7',
          keyVerseText:
            'Kính sợ Đức Giê-hô-va là khởi đầu sự tri thức; còn kẻ ngu muội khinh bỉ sự khôn ngoan và lời khuyên dạy. (Châm Ngôn 1:7)',
          reflectionPrompt:
            'Kính sợ Chúa ảnh hưởng như thế nào đến cách bạn đối xử với đồng nghiệp và người thân trong gia đình?',
        }),
      ]);

      this.logger.log('Đã tạo thành công 3 kế hoạch đọc Kinh Thánh với các phân đoạn mẫu.');
    } catch (error) {
      this.logger.warn(`Lỗi khởi tạo seed đọc Kinh Thánh: ${(error as Error).message}`);
    }
  }
}
