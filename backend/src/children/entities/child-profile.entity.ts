import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Classroom } from '../enums/children.enums.js';
import { ChildCheckin } from './child-checkin.entity.js';

@Entity({ name: 'child_profiles' })
export class ChildProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'parent_id', type: 'varchar', length: 36 })
  parentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Relation<User>;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: string; // YYYY-MM-DD

  @Column({
    type: 'enum',
    enum: Classroom,
    default: Classroom.Elementary,
  })
  classroom: Classroom;

  @Column({ type: 'varchar', length: 255, nullable: true })
  allergies: string | null;

  @Column({ name: 'special_notes', type: 'text', nullable: true })
  specialNotes: string | null;

  @Column({ name: 'emergency_contact_name', type: 'varchar', length: 150 })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_phone', type: 'varchar', length: 30 })
  emergencyContactPhone: string;

  @OneToMany(() => ChildCheckin, (checkin) => checkin.child)
  checkins: Relation<ChildCheckin[]>;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
