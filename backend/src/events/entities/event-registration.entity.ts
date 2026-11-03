import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EventPaymentStatus,
  RegistrationStatus,
} from '../enums/event.enums.js';

@Entity({ name: 'event_registrations' })
@Index(['eventId', 'userId'])
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'event_id', type: 'varchar', length: 36 })
  eventId: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'attendee_name', type: 'varchar', length: 150 })
  attendeeName: string;

  @Column({ name: 'attendee_email', type: 'varchar', length: 190 })
  attendeeEmail: string;

  @Column({ name: 'attendee_phone', type: 'varchar', length: 30, nullable: true })
  attendeePhone: string | null;

  @Column({ name: 'adult_count', type: 'int', default: 1 })
  adultCount: number;

  @Column({ name: 'child_count', type: 'int', default: 0 })
  childCount: number;

  @Column({ name: 'dietary_restrictions', type: 'varchar', length: 255, nullable: true })
  dietaryRestrictions: string | null;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: EventPaymentStatus,
    default: EventPaymentStatus.FREE,
  })
  paymentStatus: EventPaymentStatus;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.CONFIRMED,
  })
  status: RegistrationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
