import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface OrderOfServiceItem {
  order: number;
  segment: string;
  leaderOrMinister: string;
  notes?: string;
}

export interface BulletinAnnouncement {
  title: string;
  category: string;
  content: string;
  dateOrDeadline?: string;
  contactPerson?: string;
}

@Entity({ name: 'church_bulletins' })
export class ChurchBulletin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index()
  @Column({ name: 'bulletin_date', type: 'date' })
  bulletinDate: string; // YYYY-MM-DD

  @Column({ name: 'theme_scripture', type: 'varchar', length: 255 })
  themeScripture: string;

  @Column({ name: 'sermon_title', type: 'varchar', length: 255 })
  sermonTitle: string;

  @Column({ name: 'preacher_name', type: 'varchar', length: 150 })
  preacherName: string;

  @Column({ name: 'order_of_service', type: 'simple-json' })
  orderOfService: OrderOfServiceItem[];

  @Column({ type: 'simple-json' })
  announcements: BulletinAnnouncement[];

  @Column({ name: 'prayer_focus', type: 'text' })
  prayerFocus: string;

  @Column({ name: 'financial_update', type: 'text', nullable: true })
  financialUpdate: string | null;

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
