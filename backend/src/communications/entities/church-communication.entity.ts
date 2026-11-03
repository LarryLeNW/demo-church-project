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
import {
  CommunicationChannel,
  CommunicationType,
  MessageStatus,
  TargetAudience,
} from '../enums/communication.enums.js';

@Entity({ name: 'church_communications' })
export class ChurchCommunication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sender_id', type: 'varchar', length: 36 })
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: Relation<User>;

  @Column({
    type: 'enum',
    enum: CommunicationChannel,
    default: CommunicationChannel.SMS,
  })
  channel: CommunicationChannel;

  @Column({
    type: 'enum',
    enum: CommunicationType,
    default: CommunicationType.GeneralAnnouncement,
  })
  type: CommunicationType;

  @Column({
    name: 'target_audience',
    type: 'enum',
    enum: TargetAudience,
    default: TargetAudience.AllMembers,
  })
  targetAudience: TargetAudience;

  @Column({ name: 'target_group_id', type: 'varchar', length: 36, nullable: true })
  targetGroupId: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'recipient_count', type: 'int', default: 0 })
  recipientCount: number;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.Sent,
  })
  status: MessageStatus;

  @Index()
  @Column({ name: 'sent_at', type: 'datetime' })
  sentAt: Date;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
