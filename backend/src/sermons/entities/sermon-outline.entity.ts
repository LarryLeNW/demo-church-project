import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutlinePoint } from '../interfaces/sermon.interface.js';

@Entity({ name: 'sermon_outlines' })
export class SermonOutline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 220 })
  title: string;

  @Column({ name: 'title_en', type: 'varchar', length: 220 })
  titleEn: string;

  @Column({ name: 'series_name', type: 'varchar', length: 150, default: 'Loạt Bài Giảng Chúa Nhật' })
  seriesName: string;

  @Column({ name: 'preacher_name', type: 'varchar', length: 150, default: 'Mục Sư Quản Nhiệm' })
  preacherName: string;

  @Index()
  @Column({ name: 'service_date', type: 'varchar', length: 20 })
  serviceDate: string; // YYYY-MM-DD

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ name: 'main_scripture_ref', type: 'varchar', length: 100 })
  mainScriptureRef: string;

  @Column({ name: 'main_scripture_text_vi', type: 'text' })
  mainScriptureTextVi: string;

  @Column({ name: 'main_scripture_text_en', type: 'text' })
  mainScriptureTextEn: string;

  @Column({
    name: 'outline_points',
    type: 'json',
  })
  outlinePoints: OutlinePoint[];

  @Column({
    name: 'discussion_questions',
    type: 'json',
    nullable: true,
  })
  discussionQuestions: string[];

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
