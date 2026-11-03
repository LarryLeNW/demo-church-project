import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BackgroundCheckStatus,
  VolunteerStatus,
} from '../enums/volunteer.enums.js';

@Entity({ name: 'volunteer_members' })
@Index(['teamId', 'userId'], { unique: true })
export class VolunteerMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'team_id', type: 'varchar', length: 36 })
  teamId: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'role_in_team', type: 'varchar', length: 150, default: 'Thành viên phụng sự' })
  roleInTeam: string;

  @Column({
    type: 'enum',
    enum: VolunteerStatus,
    default: VolunteerStatus.ACTIVE,
  })
  status: VolunteerStatus;

  @Column({
    name: 'background_check_status',
    type: 'enum',
    enum: BackgroundCheckStatus,
    default: BackgroundCheckStatus.NOT_REQUIRED,
  })
  backgroundCheckStatus: BackgroundCheckStatus;

  @Column({ name: 'background_check_approved_at', type: 'varchar', length: 20, nullable: true })
  backgroundCheckApprovedAt: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
