import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseCategory, CourseLanguage } from './enums/course.enums.js';
import { Course } from './entities/course.entity.js';
import { Lesson } from './entities/lesson.entity.js';

@Injectable()
export class CoursesSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CoursesSeedService.name);

  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.courseRepo.count();
      if (count > 0) {
        return;
      }

      this.logger.log('Khởi tạo dữ liệu mẫu cho Kho Bài Giảng & Môn Đồ Hóa...');

      // Khóa 1: Nền Tảng Đời Sống Cơ Đốc
      const course1 = await this.courseRepo.save(
        this.courseRepo.create({
          title: 'Nền Tảng Đời Sống Cơ Đốc (Foundations of Faith)',
          slug: 'nen-tang-doi-song-co-doc',
          description:
            'Chương trình môn đồ hóa căn bản dành cho tân tín hữu và người khao khát xây dựng nền móng đức tin vững chắc trên Lời Hằng Sống của Đức Chúa Trời.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80',
          category: CourseCategory.Discipleship,
          language: CourseLanguage.Vietnamese,
          instructorName: 'Mục Sư Quản Nhiệm John Tran',
          orderIndex: 1,
          isPublished: true,
        }),
      );

      await this.lessonRepo.save([
        this.lessonRepo.create({
          courseId: course1.id,
          title: 'Bài 1: Sự Tái Sinh và Đời Sống Mới trong Chúa Cứu Thế',
          slug: 'bai-1-su-tai-sinh-va-doi-song-moi',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: 1800,
          scriptureReference: 'Giăng 3:1-16; 2 Cô-rinh-tô 5:17',
          studyGuidePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          discussionQuestions: [
            'Sự tái sinh biến đổi tấm lòng và định hướng sống của bạn như thế nào?',
            'Điều gì làm bạn cảm thấy được giải phóng nhất khi nhận biết ân điển cứu chuộc của Chúa Jesus?',
          ],
          orderIndex: 1,
        }),
        this.lessonRepo.create({
          courseId: course1.id,
          title: 'Bài 2: Đời Sống Cầu Nguyện & Tương Giao Mật Thiết với Chúa',
          slug: 'bai-2-doi-song-cau-nguyen',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: 2100,
          scriptureReference: 'Ma-thi-ơ 6:5-15; Phi-líp 4:6-7',
          studyGuidePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          discussionQuestions: [
            'Làm thế nào để duy trì thì giờ tĩnh nguyện buổi sáng giữa lịch trình bận rộn tại Mỹ?',
            'Lời Cầu Nguyện Chung của Chúa Jesus dạy chúng ta những ưu tiên nào khi đến trước ngôi ơn phước?',
          ],
          orderIndex: 2,
        }),
        this.lessonRepo.create({
          courseId: course1.id,
          title: 'Bài 3: Sức Mạnh & Sự Dẫn Dắt của Lời Chúa',
          slug: 'bai-3-suc-manh-loi-chua',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: 1950,
          scriptureReference: 'Thi Thiên 119:105; 2 Ti-mô-thê 3:16-17',
          studyGuidePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          discussionQuestions: [
            'Kinh Thánh đóng vai trò như thế nào như ngọn đèn soi lối trong quyết định tài chính và công việc của bạn?',
          ],
          orderIndex: 3,
        }),
      ]);

      // Khóa 2: Sermon Vault - Dòng Chảy Đức Tin Trong Gia Đình Cơ Đốc
      const course2 = await this.courseRepo.save(
        this.courseRepo.create({
          title: 'Sermon Vault: Dòng Chảy Đức Tin Trong Gia Đình Cơ Đốc',
          slug: 'sermon-vault-gia-dinh-co-doc',
          description:
            'Tuyển tập các sứ điệp bài giảng đặc sắc dành cho hôn nhân, nuôi dạy con cái và gìn giữ ngọn lửa đức tin qua các thế hệ gia đình tại Hoa Kỳ.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
          category: CourseCategory.SermonArchive,
          language: CourseLanguage.Bilingual,
          instructorName: 'Mục Sư Quản Nhiệm & Khách Mời Mục Vụ',
          orderIndex: 2,
          isPublished: true,
        }),
      );

      await this.lessonRepo.save([
        this.lessonRepo.create({
          courseId: course2.id,
          title: 'Sứ Điệp: Thiết Lập Bàn Thờ Gia Đình Giữa Xã Hội Hiện Đại',
          slug: 'su-diep-ban-tho-gia-dinh',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: 2700,
          scriptureReference: 'Phục Truyền 6:4-9; Giô-suê 24:14-15',
          studyGuidePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          discussionQuestions: [
            'Gia đình bạn có thể bắt đầu giờ thờ phượng gia đình 15 phút mỗi tuần vào ngày nào?',
            'Làm thế nào để cha mẹ làm gương sống đạo thay vì chỉ ra lệnh cho con cái?',
          ],
          orderIndex: 1,
        }),
        this.lessonRepo.create({
          courseId: course2.id,
          title: 'Sứ Điệp: Hôn Nhân Thánh Khiết - Bền Lòng Yêu Thương Như Đấng Christ Yêu Hội Thánh',
          slug: 'su-diep-hon-nhan-thanh-khiet',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: 2500,
          scriptureReference: 'Ê-phê-sô 5:21-33; 1 Cô-rinh-tô 13:4-8',
          studyGuidePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          discussionQuestions: [
            'Sự tha thứ và nhịn nhục đóng vai trò then chốt như thế nào trong đời sống vợ chồng?',
          ],
          orderIndex: 2,
        }),
      ]);

      // Khóa 3: Đào Tạo Chấp Sự & Ban Điều Hành Mục Vụ
      const course3 = await this.courseRepo.save(
        this.courseRepo.create({
          title: 'Đào Tạo Chấp Sự & Lãnh Đạo Mục Vụ (Servant Leadership)',
          slug: 'dao-tao-chap-su-lanh-dao-muc-vu',
          description:
            'Khóa huấn luyện chuyên sâu về tinh thần lãnh đạo tôi tớ theo gương Chúa Jesus, quản trị hội thánh và mục vụ chăm sóc bầy chiên của Đức Chúa Trời.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
          category: CourseCategory.Leadership,
          language: CourseLanguage.Vietnamese,
          instructorName: 'Hội Đồng Mục Sư Lão Thành',
          orderIndex: 3,
          isPublished: true,
        }),
      );

      await this.lessonRepo.save([
        this.lessonRepo.create({
          courseId: course3.id,
          title: 'Bài 1: Phẩm Chất Thuộc Linh & Đạo Đức của Người Phục Vụ',
          slug: 'bai-1-pham-chat-thuoc-linh-chap-su',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          duration: 2400,
          scriptureReference: '1 Ti-mô-thê 3:8-13; Công Vụ 6:1-7',
          studyGuidePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          discussionQuestions: [
            'Tại sao sự hòa thuận trong gia đình là điều kiện tiên quyết trước khi phục vụ nhà Chúa?',
          ],
          orderIndex: 1,
        }),
      ]);

      this.logger.log('Đã tạo thành công 3 khóa học mẫu với 6 bài giảng phong phú.');
    } catch (error) {
      this.logger.warn(`Lỗi khởi tạo seed khóa học: ${(error as Error).message}`);
    }
  }
}
