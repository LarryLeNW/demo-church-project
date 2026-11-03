import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScriptureVerse } from './entities/scripture-verse.entity.js';
import { BibleTranslation, ScriptureTopic } from './enums/scripture.enums.js';

@Injectable()
export class ScriptureSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ScriptureSeedService.name);

  constructor(
    @InjectRepository(ScriptureVerse)
    private readonly verseRepo: Repository<ScriptureVerse>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.verseRepo.count();
      if (count > 0) {
        return;
      }

      this.logger.log('Khởi tạo thư viện Câu Gốc Lời Chúa song ngữ (NIV/ESV & RVV11)...');

      await this.verseRepo.save([
        this.verseRepo.create({
          reference: 'Giăng 3:16',
          referenceEn: 'John 3:16',
          textVi:
            'Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.',
          textEn:
            'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
          defaultTranslation: BibleTranslation.RVV11,
          topic: ScriptureTopic.Salvation,
          orderIndex: 1,
        }),
        this.verseRepo.create({
          reference: 'Phi-líp 4:13',
          referenceEn: 'Philippians 4:13',
          textVi: 'Tôi làm được mọi sự nhờ Đấng ban thêm sức cho tôi.',
          textEn: 'I can do all things through him who strengthens me.',
          defaultTranslation: BibleTranslation.RVV11,
          topic: ScriptureTopic.Faith,
          orderIndex: 2,
        }),
        this.verseRepo.create({
          reference: 'Rô-ma 8:28',
          referenceEn: 'Romans 8:28',
          textVi:
            'Chúng ta biết rằng mọi sự hiệp lại làm ích cho kẻ yêu mến Đức Chúa Trời, tức là cho kẻ được gọi theo ý muốn Ngài đã định.',
          textEn:
            'And we know that for those who love God all things work together for good, for those who are called according to his purpose.',
          defaultTranslation: BibleTranslation.RVV11,
          topic: ScriptureTopic.PeaceHope,
          orderIndex: 3,
        }),
        this.verseRepo.create({
          reference: 'Thi Thiên 119:105',
          referenceEn: 'Psalm 119:105',
          textVi: 'Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.',
          textEn: 'Your word is a lamp to my feet and a light to my path.',
          defaultTranslation: BibleTranslation.RVV11,
          topic: ScriptureTopic.ScripturePower,
          orderIndex: 4,
        }),
        this.verseRepo.create({
          reference: 'Ma-thi-ơ 6:33',
          referenceEn: 'Matthew 6:33',
          textVi:
            'Nhưng trước hết, hãy tìm kiếm nước Đức Chúa Trời và sự công chính của Ngài, thì Ngài sẽ cho thêm các ngươi mọi điều ấy nữa.',
          textEn:
            'But seek first the kingdom of God and his righteousness, and all these things will be added to you.',
          defaultTranslation: BibleTranslation.RVV11,
          topic: ScriptureTopic.Discipleship,
          orderIndex: 5,
        }),
        this.verseRepo.create({
          reference: 'Giô-suê 24:15',
          referenceEn: 'Joshua 24:15',
          textVi: 'Nhưng tôi và nhà tôi sẽ phụng sự Đức Giê-hô-va.',
          textEn: 'But as for me and my house, we will serve the Lord.',
          defaultTranslation: BibleTranslation.RVV11,
          topic: ScriptureTopic.Family,
          orderIndex: 6,
        }),
      ]);

      this.logger.log('Đã nạp thành công 6 câu gốc nền tảng vào Thư Viện Lời Chúa.');
    } catch (error) {
      this.logger.warn(`Lỗi khởi tạo seed câu gốc: ${(error as Error).message}`);
    }
  }
}
