import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CareStatus,
  CareType,
  CareUrgency,
} from '../enums/pastoral.enums.js';

@Entity({ name: 'pastoral_care_requests' })
export class PastoralCareRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Index()
  @Column({ name: 'household_id', type: 'varchar', length: 36, nullable: true })
  householdId: string | null;

  @Column({
    name: 'request_type',
    type: 'enum',
    enum: CareType,
    default: CareType.HOSPITAL_VISIT,
  })
  requestType: CareType;

  @Column({
    type: 'enum',
    enum: CareUrgency,
    default: CareUrgency.ROUTINE,
  })
  urgency: CareUrgency;

  @Column({ name: 'patient_or_member_name', type: 'varchar', length: 150 })
  patientOrMemberName: string;

  @Column({ name: 'hospital_or_address', type: 'varchar', length: 255 })
  hospitalOrAddress: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 30 })
  contactPhone: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: CareStatus,
    default: CareStatus.PENDING,
  })
  status: CareStatus;

  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ name: 'assigned_pastor_id', type: 'varchar', length: 36, nullable: true })
  assignedPastorId: string | null;

  @Column({ name: 'assigned_pastor_name', type: 'varchar', length: 150, nullable: true })
  assignedPastorName: string | null;

  @Column({ name: 'scheduled_at', type: 'varchar', length: 30, nullable: true })
  scheduledAt: string | null;

  @Column({ name: 'pastoral_report', type: 'text', nullable: true })
  pastoralReport: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
