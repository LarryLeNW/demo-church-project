import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity({ name: 'devotional_journals' })
export class DevotionalJournal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ name: 'plan_id', type: 'varchar', length: 36, nullable: true })
  planId: string | null;

  @Column({ name: 'day_number', type: 'int', nullable: true })
  dayNumber: number | null;

  @Column({ type: 'varchar', length: 150 })
  passage: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({
    name: 'rhema_word',
    type: 'text',
    comment: 'S - Scripture: Câu Kinh Thánh Chúa phán đánh động lòng bạn',
  })
  rhemaWord: string;

  @Column({
    type: 'text',
    comment: 'O - Observation: Bạn quan sát thấy điều gì về bản tính của Đức Chúa Trời',
  })
  observation: string;

  @Column({
    type: 'text',
    comment: 'A - Application: Áp dụng cụ thể vào công việc, gia đình và đời sống',
  })
  application: string;

  @Column({
    type: 'text',
    comment: 'P - Prayer: Lời cầu nguyện chân thành đáp ứng Lời Chúa',
  })
  prayer: string;

  @Column({ name: 'is_private', type: 'boolean', default: true })
  isPrivate: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
