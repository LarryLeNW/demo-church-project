import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RosterStatus } from '../enums/volunteer.enums.js';

@Entity({ name: 'sunday_rosters' })
export class SundayRoster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'service_date', type: 'varchar', length: 20 })
  serviceDate: string; // YYYY-MM-DD

  @Column({ name: 'service_title', type: 'varchar', length: 200, default: 'Lễ Thờ Phượng Chúa Nhật' })
  serviceTitle: string;

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Index()
  @Column({ name: 'team_id', type: 'varchar', length: 36 })
  teamId: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'role_title', type: 'varchar', length: 150 })
  roleTitle: string;

  @Column({
    type: 'enum',
    enum: RosterStatus,
    default: RosterStatus.PENDING,
  })
  status: RosterStatus;

  @Column({ name: 'decline_reason', type: 'varchar', length: 500, nullable: true })
  declineReason: string | null;

  @Column({ name: 'swap_target_user_id', type: 'varchar', length: 36, nullable: true })
  swapTargetUserId: string | null;

  @Column({ name: 'swap_notes', type: 'varchar', length: 500, nullable: true })
  swapNotes: string | null;

  @Column({ name: 'reminder_sent', type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
