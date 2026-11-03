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
import { User } from '../../users/entities/user.entity.js';
import { BiblePlan } from './bible-plan.entity.js';

@Entity({ name: 'user_plan_subscriptions' })
@Index(['userId', 'planId'], { unique: true })
export class UserPlanSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ name: 'plan_id', type: 'varchar', length: 36 })
  planId: string;

  @ManyToOne(() => BiblePlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: Relation<BiblePlan>;

  @Column({ name: 'start_date', type: 'datetime' })
  startDate: Date;

  @Column({
    name: 'completed_days',
    type: 'json',
    comment: 'Mảng số ngày đã hoàn thành, ví dụ: [1, 2, 3]',
  })
  completedDays: number[];

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'last_read_at', type: 'datetime', nullable: true })
  lastReadAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
