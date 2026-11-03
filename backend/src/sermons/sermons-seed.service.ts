import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonOutline } from './entities/sermon-outline.entity.js';

@Injectable()
export class SermonsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SermonsSeedService.name);

  constructor(
    @InjectRepository(SermonOutline)
    private readonly outlineRepo: Repository<SermonOutline>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.outlineRepo.count();
      if (count > 0) return;

      this.logger.log('Khởi tạo dữ liệu mẫu cho Ghi Chú Bài Giảng Tương Tác Chúa Nhật...');

      const sermonsData: Partial<SermonOutline>[] = [
        {
          title: 'Sức Mạnh Của Lòng Biết Ơn Trong Mọi Hoàn Cảnh',
          titleEn: 'The Power of Gratitude in Every Circumstance',
          seriesName: 'Mùa Tạ Ơn & Ân Điển (Season of Grace)',
          preacherName: 'Mục Sư Quản Nhiệm David Nguyen',
          serviceDate: '2026-11-08',
          campusId: 'Dallas Main Campus',
          mainScriptureRef: '1 Tê-sa-lô-ni-ca 5:16-18',
          mainScriptureTextVi:
            'Hãy vui mừng mãi mãi, cầu nguyện không thôi, phàm việc gì cũng phải tạ ơn Chúa; vì bắp ý muốn của Đức Chúa Trời trong Đức Chúa Jêsus Christ đối với anh em là như vậy.',
          mainScriptureTextEn:
            'Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.',
          outlinePoints: [
            {
              id: 'p1',
              pointNumber: 1,
              titleVi: 'Sự tạ ơn chuyển hướng tâm trí từ nan đề sang Đấng Giải Cứu',
              titleEn: 'Thanksgiving shifts our focus from the problem to the Deliverer',
              scriptureRef: 'Thi Thiên 103:2',
              scriptureTextVi: 'Hỡi linh hồn ta, hãy ngợi khen Đức Giê-hô-va, chớ quên các ân huệ của Ngài.',
              scriptureTextEn: 'Praise the Lord, my soul, and forget not all his benefits.',
              fillInBlankTextVi:
                'Khi chúng ta tạ ơn, chúng ta không chối bỏ nan đề, nhưng chúng ta công bố rằng Đức Chúa Trời {{lớn hơn}} mọi thử thách.',
              blankAnswersVi: ['lớn hơn'],
              fillInBlankTextEn:
                'When we give thanks, we do not deny our problems, but declare that God is {{greater}} than any trial.',
              blankAnswersEn: ['greater'],
            },
            {
              id: 'p2',
              pointNumber: 2,
              titleVi: 'Lời tạ ơn bảo vệ tấm lòng khỏi sự cay đắng và phàn nàn',
              titleEn: 'Gratitude guards our hearts against bitterness and complaint',
              scriptureRef: 'Phi-líp 4:6-7',
              scriptureTextVi:
                'Chớ lo phiền chi hết, nhưng trong mọi sự hãy dùng lời cầu nguyện, nài xin, và sự tạ ơn mà trình các sự cầu xin của mình cho Đức Chúa Trời.',
              scriptureTextEn:
                'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
              fillInBlankTextVi:
                'Sự phàn nàn làm khô héo đức tin, trong khi lòng biết ơn mời gọi {{sự bình an}} vượt quá mọi sự hiểu biết bảo vệ tâm trí.',
              blankAnswersVi: ['sự bình an'],
              fillInBlankTextEn:
                'Complaining withers our faith, whereas gratitude invites the {{peace}} that transcends understanding to guard our minds.',
              blankAnswersEn: ['peace'],
            },
            {
              id: 'p3',
              pointNumber: 3,
              titleVi: 'Tạ ơn là quyết định của đức tin, không phải cảm xúc nhất thời',
              titleEn: 'Thanksgiving is an act of faith, not a fleeting emotion',
              scriptureRef: 'Ha-ba-cúc 3:17-18',
              scriptureTextVi:
                'Dầu cây vả sẽ không nứt lộc nữa... dẫu vậy, tôi sẽ vui mừng trong Đức Giê-hô-va, tôi sẽ hớn hở trong Đức Chúa Trời của sự cứu rỗi tôi.',
              scriptureTextEn:
                'Though the fig tree does not bud... yet I will rejoice in the Lord, I will be joyful in God my Savior.',
              fillInBlankTextVi:
                'Tạ ơn Chúa trong lúc thuận cảnh là tự nhiên, nhưng tạ ơn Chúa giữa bão giông là một của lễ {{tôn vinh}} làm rúng động cõi thuộc linh.',
              blankAnswersVi: ['tôn vinh'],
              fillInBlankTextEn:
                'Thanking God in prosperity is natural, but praising Him in storms is a sacrifice of {{praise}} that moves the spiritual realm.',
              blankAnswersEn: ['praise'],
            },
          ],
          discussionQuestions: [
            '1. Trong tuần qua, nan đề nào khiến bạn dễ rơi vào sự lo lắng hoặc phàn nàn nhất?',
            '2. Khi đọc Thi Thiên 103:2, hãy kể ra 3 ơn phước cụ thể Chúa đã làm trên gia đình bạn trong năm nay.',
            '3. Bạn sẽ cam kết thực hành lời tạ ơn thế nào trong những tình huống khó khăn sắp tới?',
          ],
          isPublished: true,
        },
      ];

      await this.outlineRepo.save(sermonsData.map((s) => this.outlineRepo.create(s)));
    } catch (err) {
      this.logger.warn(`Không thể khởi tạo seed sermons: ${(err as Error).message}`);
    }
  }
}
