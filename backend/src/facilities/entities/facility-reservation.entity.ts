import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { ReservationStatus } from '../enums/facility.enums.js';
import { FacilityRoom } from './facility-room.entity.js';

@Entity({ name: 'facility_reservations' })
export class FacilityReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'room_id', type: 'varchar', length: 36 })
  roomId: string;

  @ManyToOne(() => FacilityRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Relation<FacilityRoom>;

  @Index()
  @Column({ name: 'requested_by_user_id', type: 'varchar', length: 36 })
  requestedByUserId: string;

  @Column({ name: 'requested_by_user_name', type: 'varchar', length: 150 })
  requestedByUserName: string;

  @Column({ name: 'event_name', type: 'varchar', length: 200 })
  eventName: string;

  @Column({ name: 'ministry_name', type: 'varchar', length: 150 })
  ministryName: string;

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Index()
  @Column({ name: 'start_time', type: 'varchar', length: 30 })
  startTime: string; // ISO String

  @Index()
  @Column({ name: 'end_time', type: 'varchar', length: 30 })
  endTime: string; // ISO String

  @Column({ name: 'setup_notes', type: 'text', nullable: true })
  setupNotes: string | null;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ name: 'approved_by_user_id', type: 'varchar', length: 36, nullable: true })
  approvedByUserId: string | null;

  @Column({ name: 'approved_by_user_name', type: 'varchar', length: 150, nullable: true })
  approvedByUserName: string | null;

  @Column({ name: 'rejection_reason', type: 'varchar', length: 500, nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
