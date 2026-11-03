import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventCategory } from '../enums/event.enums.js';

@Entity({ name: 'church_events' })
export class ChurchEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'title_en', type: 'varchar', length: 200 })
  titleEn: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 220 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: EventCategory,
    default: EventCategory.WORSHIP,
  })
  category: EventCategory;

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ name: 'start_date', type: 'varchar', length: 30 })
  startDate: string; // ISO String (e.g. 2026-11-26T18:00:00)

  @Column({ name: 'end_date', type: 'varchar', length: 30, nullable: true })
  endDate: string | null;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'banner_url', type: 'varchar', length: 500, nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'requires_registration', type: 'boolean', default: true })
  requiresRegistration: boolean;

  @Column({ name: 'max_attendees', type: 'int', nullable: true })
  maxAttendees: number | null;

  @Column({ name: 'registered_count', type: 'int', default: 0 })
  registeredCount: number;

  @Column({ name: 'registration_deadline', type: 'varchar', length: 30, nullable: true })
  registrationDeadline: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost: number; // 0 = Free

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
