import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ministry_teams' })
export class MinistryTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 150 })
  nameEn: string;

  @Column({ name: 'leader_id', type: 'varchar', length: 36, nullable: true })
  leaderId: string | null;

  @Column({ name: 'campus_id', type: 'varchar', length: 100, default: 'Dallas Main Campus' })
  campusId: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'required_clearance', type: 'boolean', default: false })
  requiredClearance: boolean;

  @Column({ type: 'varchar', length: 50, default: 'indigo' })
  color: string;

  @Column({ name: 'icon_name', type: 'varchar', length: 50, default: 'Users' })
  iconName: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
