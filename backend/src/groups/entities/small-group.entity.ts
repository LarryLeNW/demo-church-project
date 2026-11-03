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
import { GroupCategory } from '../enums/group.enums.js';
import { GroupMember } from './group-member.entity.js';

@Entity({ name: 'small_groups' })
export class SmallGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'leader_id', type: 'varchar', length: 36 })
  leaderId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'leader_id' })
  leader: Relation<User>;

  @Column({ type: 'enum', enum: GroupCategory, default: GroupCategory.Families })
  category: GroupCategory;

  @Column({ name: 'schedule_rule', type: 'varchar', length: 100, comment: 'VD: Thứ Sáu 19:30' })
  scheduleRule: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Tư gia hoặc phòng nhóm' })
  location: string | null;

  @Column({ name: 'zoom_link', type: 'varchar', length: 500, nullable: true })
  zoomLink: string | null;

  @Index()
  @Column({ type: 'varchar', length: 10, nullable: true, comment: 'US Zipcode' })
  zipcode: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: Relation<GroupMember[]>;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
