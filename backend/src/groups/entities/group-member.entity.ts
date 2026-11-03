import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { GroupMemberRole } from '../enums/group.enums.js';
import { SmallGroup } from './small-group.entity.js';

@Entity({ name: 'group_members' })
@Index(['groupId', 'userId'], { unique: true })
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_id', type: 'varchar', length: 36 })
  groupId: string;

  @ManyToOne(() => SmallGroup, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Relation<SmallGroup>;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'enum', enum: GroupMemberRole, default: GroupMemberRole.Member })
  role: GroupMemberRole;

  @CreateDateColumn({ name: 'joined_at', type: 'datetime' })
  joinedAt: Date;
}
