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
import { AttendanceStatus } from '../enums/group.enums.js';
import { SmallGroup } from './small-group.entity.js';

@Entity({ name: 'group_attendances' })
@Index(['groupId', 'userId', 'sessionDate'], { unique: true })
export class GroupAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_id', type: 'varchar', length: 36 })
  groupId: string;

  @ManyToOne(() => SmallGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Relation<SmallGroup>;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ name: 'session_date', type: 'date' })
  sessionDate: string;

  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.Present })
  status: AttendanceStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes: string | null;

  @Column({ name: 'marked_by_id', type: 'varchar', length: 36 })
  markedById: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
