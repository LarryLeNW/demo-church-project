import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EquipmentCondition, EquipmentType } from '../enums/facility.enums.js';

@Entity({ name: 'equipment_items' })
export class EquipmentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: EquipmentType,
    default: EquipmentType.AUDIO_SOUND,
  })
  type: EquipmentType;

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'available_quantity', type: 'int', default: 1 })
  availableQuantity: number;

  @Column({
    type: 'enum',
    enum: EquipmentCondition,
    default: EquipmentCondition.EXCELLENT,
  })
  condition: EquipmentCondition;

  @Column({ type: 'varchar', length: 150 })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
