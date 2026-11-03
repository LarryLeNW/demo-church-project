import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { PrayerCategory, PrayerStatus } from '../enums/prayer.enums.js';
import { PrayerIntercession } from './prayer-intercession.entity.js';

@Entity({ name: 'prayer_requests' })
export class PrayerRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36, nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User> | null;

  @Column({ name: 'author_name', type: 'varchar', length: 150 })
  authorName: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PrayerCategory,
    default: PrayerCategory.General,
  })
  category: PrayerCategory;

  @Column({
    name: 'is_confidential',
    type: 'boolean',
    default: false,
    comment: 'Kín nhiệm: Chỉ Mục sư & Ban Trị Sự được xem',
  })
  isConfidential: boolean;

  @Column({ name: 'is_anonymous', type: 'boolean', default: false })
  isAnonymous: boolean;

  @Column({ name: 'is_answered', type: 'boolean', default: false })
  isAnswered: boolean;

  @Column({
    name: 'praise_report',
    type: 'text',
    nullable: true,
    comment: 'Lời chứng tạ ơn Chúa đã nhậm lời',
  })
  praiseReport: string | null;

  @Column({ name: 'prayer_count', type: 'int', default: 0 })
  prayerCount: number;

  @Column({
    type: 'enum',
    enum: PrayerStatus,
    default: PrayerStatus.Approved,
  })
  status: PrayerStatus;

  @OneToMany(
    () => PrayerIntercession,
    (intercession) => intercession.prayerRequest,
  )
  intercessions: Relation<PrayerIntercession[]>;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
