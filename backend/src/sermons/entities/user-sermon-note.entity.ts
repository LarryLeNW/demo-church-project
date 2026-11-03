import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_sermon_notes' })
@Index(['outlineId', 'userId'], { unique: true })
export class UserSermonNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'outline_id', type: 'varchar', length: 36 })
  outlineId: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  /** Lưu các từ điền khuyết theo format { [pointId_blankIndex]: string } */
  @Column({
    name: 'filled_answers',
    type: 'json',
    nullable: true,
  })
  filledAnswers: Record<string, string>;

  /** Lưu ghi chú cá nhân theo format { [pointId]: string } */
  @Column({
    name: 'personal_notes',
    type: 'json',
    nullable: true,
  })
  personalNotes: Record<string, string>;

  @Column({ name: 'prayer_commitment', type: 'text', nullable: true })
  prayerCommitment: string | null;

  @Column({ name: 'is_emailed', type: 'boolean', default: false })
  isEmailed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
