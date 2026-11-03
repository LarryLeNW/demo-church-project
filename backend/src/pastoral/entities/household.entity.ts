import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface HouseholdMember {
  userId?: string;
  fullName: string;
  roleInFamily: 'head' | 'spouse' | 'child' | 'relative';
  birthday?: string;
}

@Entity({ name: 'households' })
export class Household {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string; // e.g. "Gia đình David & Mary Tran"

  @Index()
  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ name: 'primary_phone', type: 'varchar', length: 30 })
  primaryPhone: string;

  @Column({ name: 'address_line1', type: 'varchar', length: 255 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 100, default: 'Plano' })
  city: string;

  @Column({ type: 'varchar', length: 20, default: 'TX' })
  state: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  zipcode: string;

  @Column({ name: 'wedding_anniversary', type: 'varchar', length: 20, nullable: true })
  weddingAnniversary: string | null;

  @Column({
    type: 'json',
    nullable: true,
  })
  members: HouseholdMember[];

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
