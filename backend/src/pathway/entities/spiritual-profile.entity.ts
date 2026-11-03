import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BaptismStatus,
  MilestoneHistoryRecord,
  SpiritualStage,
} from '../enums/pathway.enums.js';

@Entity({ name: 'spiritual_profiles' })
export class SpiritualProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({
    name: 'current_stage',
    type: 'enum',
    enum: SpiritualStage,
    default: SpiritualStage.NEW_BELIEVER,
  })
  currentStage: SpiritualStage;

  @Column({
    name: 'baptism_status',
    type: 'enum',
    enum: BaptismStatus,
    default: BaptismStatus.NOT_STARTED,
  })
  baptismStatus: BaptismStatus;

  @Column({ name: 'salvation_date', type: 'varchar', length: 20, nullable: true })
  salvationDate: string | null;

  @Column({ name: 'salvation_testimony', type: 'text', nullable: true })
  salvationTestimony: string | null;

  @Column({ name: 'baptism_date', type: 'varchar', length: 20, nullable: true })
  baptismDate: string | null;

  @Column({ name: 'baptism_class_completed_at', type: 'varchar', length: 20, nullable: true })
  baptismClassCompletedAt: string | null;

  @Column({ name: 'baptized_by', type: 'varchar', length: 150, nullable: true })
  baptizedBy: string | null;

  @Column({ name: 'communion_eligible', type: 'boolean', default: false })
  communionEligible: boolean;

  @Column({ name: 'mentor_name', type: 'varchar', length: 150, nullable: true })
  mentorName: string | null;

  @Column({ name: 'pastoral_notes', type: 'text', nullable: true })
  pastoralNotes: string | null;

  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({
    name: 'milestone_history',
    type: 'json',
    nullable: true,
  })
  milestoneHistory: MilestoneHistoryRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
