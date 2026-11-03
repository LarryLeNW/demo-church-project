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
import {
  BibleTranslation,
  MemoryStatus,
  ScriptureTopic,
} from '../enums/scripture.enums.js';
import { ScriptureVerse } from './scripture-verse.entity.js';

@Entity({ name: 'scripture_memories' })
@Index(['userId', 'reference'], { unique: true })
export class ScriptureMemory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ name: 'verse_id', type: 'varchar', length: 36, nullable: true })
  verseId: string | null;

  @ManyToOne(() => ScriptureVerse, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'verse_id' })
  verse: Relation<ScriptureVerse> | null;

  @Column({ type: 'varchar', length: 150 })
  reference: string;

  @Column({ type: 'text' })
  text: string;

  @Column({
    type: 'enum',
    enum: BibleTranslation,
    default: BibleTranslation.RVV11,
  })
  translation: BibleTranslation;

  @Column({
    type: 'enum',
    enum: ScriptureTopic,
    default: ScriptureTopic.Faith,
  })
  topic: ScriptureTopic;

  @Column({ name: 'interval_days', type: 'int', default: 1 })
  intervalDays: number;

  @Column({
    name: 'ease_factor',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 2.5,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  easeFactor: number;

  @Column({ name: 'repetition_count', type: 'int', default: 0 })
  repetitionCount: number;

  @Index()
  @Column({ name: 'next_review_date', type: 'datetime' })
  nextReviewDate: Date;

  @Column({ name: 'last_reviewed_at', type: 'datetime', nullable: true })
  lastReviewedAt: Date | null;

  @Column({
    type: 'enum',
    enum: MemoryStatus,
    default: MemoryStatus.Learning,
  })
  status: MemoryStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
