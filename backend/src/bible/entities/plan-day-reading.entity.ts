import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { BiblePlan } from './bible-plan.entity.js';

@Entity({ name: 'plan_day_readings' })
@Index(['planId', 'dayNumber'], { unique: true })
export class PlanDayReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plan_id', type: 'varchar', length: 36 })
  planId: string;

  @ManyToOne(() => BiblePlan, (plan) => plan.readings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: Relation<BiblePlan>;

  @Column({ name: 'day_number', type: 'int' })
  dayNumber: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({
    name: 'passage_old_testament',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  passageOldTestament: string | null;

  @Column({
    name: 'passage_new_testament',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  passageNewTestament: string | null;

  @Column({
    name: 'passage_psalm_proverbs',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  passagePsalmProverbs: string | null;

  @Column({ name: 'key_verse_text', type: 'text', nullable: true })
  keyVerseText: string | null;

  @Column({ name: 'reflection_prompt', type: 'text', nullable: true })
  reflectionPrompt: string | null;
}
