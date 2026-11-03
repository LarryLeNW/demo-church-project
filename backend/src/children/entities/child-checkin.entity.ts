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
import { CheckinStatus, Classroom } from '../enums/children.enums.js';
import { ChildProfile } from './child-profile.entity.js';

@Entity({ name: 'child_checkins' })
export class ChildCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'child_id', type: 'varchar', length: 36 })
  childId: string;

  @ManyToOne(() => ChildProfile, (child) => child.checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: Relation<ChildProfile>;

  @Index()
  @Column({ name: 'parent_id', type: 'varchar', length: 36 })
  parentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Relation<User>;

  @Index()
  @Column({ name: 'session_date', type: 'date' })
  sessionDate: string; // YYYY-MM-DD

  @Index()
  @Column({ name: 'security_code', type: 'varchar', length: 12 })
  securityCode: string; // e.g. "K-8392"

  @Column({
    type: 'enum',
    enum: Classroom,
  })
  classroom: Classroom;

  @Column({ name: 'checkin_time', type: 'datetime' })
  checkinTime: Date;

  @Column({ name: 'checkout_time', type: 'datetime', nullable: true })
  checkoutTime: Date | null;

  @Column({ name: 'checked_in_by_user_id', type: 'varchar', length: 36 })
  checkedInByUserId: string;

  @Column({ name: 'checked_out_by_user_id', type: 'varchar', length: 36, nullable: true })
  checkedOutByUserId: string | null;

  @Column({
    type: 'enum',
    enum: CheckinStatus,
    default: CheckinStatus.CheckedIn,
  })
  status: CheckinStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
