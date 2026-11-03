import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Course } from './course.entity.js';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'varchar', length: 36 })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Index()
  @Column({ type: 'varchar', length: 190 })
  slug: string;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string | null;

  @Column({ type: 'int', default: 0, comment: 'Thời lượng tính bằng giây' })
  duration: number;

  @Column({
    name: 'scripture_reference',
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Phân đoạn Kinh Thánh nền tảng (VD: Giăng 15:1-8)',
  })
  scriptureReference: string | null;

  @Column({
    name: 'study_guide_pdf_url',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Link tài liệu học tập hoặc câu hỏi thảo luận PDF',
  })
  studyGuidePdfUrl: string | null;

  @Column({
    name: 'discussion_questions',
    type: 'json',
    nullable: true,
    comment: 'Mảng câu hỏi thảo luận cho nhóm tế bào',
  })
  discussionQuestions: string[] | null;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
