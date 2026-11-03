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
import { PlanCategory } from '../enums/bible.enums.js';
import { PlanDayReading } from './plan-day-reading.entity.js';

@Entity({ name: 'bible_plans' })
export class BiblePlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 190 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'duration_days', type: 'int', default: 365 })
  durationDays: number;

  @Column({
    type: 'enum',
    enum: PlanCategory,
    default: PlanCategory.OneYear,
  })
  category: PlanCategory;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @OneToMany(() => PlanDayReading, (reading) => reading.plan)
  readings: Relation<PlanDayReading[]>;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
