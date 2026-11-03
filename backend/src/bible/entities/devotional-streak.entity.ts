import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity({ name: 'devotional_streaks' })
export class DevotionalStreak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ name: 'current_streak', type: 'int', default: 1 })
  currentStreak: number;

  @Column({ name: 'longest_streak', type: 'int', default: 1 })
  longestStreak: number;

  @Column({ name: 'last_active_date', type: 'varchar', length: 10 })
  lastActiveDate: string; // Stored in YYYY-MM-DD format for timezone-safe calendar comparison

  @Column({ name: 'unlocked_milestones', type: 'simple-json', nullable: false })
  unlockedMilestones: string[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
