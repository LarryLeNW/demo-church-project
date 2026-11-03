import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacilityType } from '../enums/facility.enums.js';

@Entity({ name: 'facility_rooms' })
export class FacilityRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: FacilityType,
    default: FacilityType.CLASSROOM,
  })
  type: FacilityType;

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ type: 'int', default: 30 })
  capacity: number;

  @Column({ type: 'simple-array', nullable: true })
  amenities: string[];

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ name: 'requires_approval', type: 'boolean', default: true })
  requiresApproval: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
