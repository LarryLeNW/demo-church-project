import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity({ name: 'pastoral_visit_logs' })
export class PastoralVisitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pastor_id', type: 'varchar', length: 36 })
  pastorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pastor_id' })
  pastor: Relation<User>;

  @Column({ name: 'member_id', type: 'varchar', length: 36 })
  memberId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Relation<User>;

  @Column({
    name: 'contact_type',
    type: 'varchar',
    length: 50,
    default: 'phone',
    comment: 'phone | in_person | home_visit',
  })
  contactType: string;

  @Column({ type: 'text' })
  notes: string;

  @Column({ name: 'visit_date', type: 'datetime' })
  visitDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
