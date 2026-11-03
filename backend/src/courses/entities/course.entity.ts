import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { CourseCategory, CourseLanguage } from '../enums/course.enums.js';
import { Lesson } from './lesson.entity.js';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 190 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @Column({
    type: 'enum',
    enum: CourseCategory,
    default: CourseCategory.Discipleship,
  })
  category: CourseCategory;

  @Column({
    type: 'enum',
    enum: CourseLanguage,
    default: CourseLanguage.Vietnamese,
  })
  language: CourseLanguage;

  @Column({ name: 'instructor_name', type: 'varchar', length: 150, default: 'Mục Sư Quản Nhiệm' })
  instructorName: string;

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Relation<Lesson[]>;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
