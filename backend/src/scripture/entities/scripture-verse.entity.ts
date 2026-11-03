import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BibleTranslation, ScriptureTopic } from '../enums/scripture.enums.js';

@Entity({ name: 'scripture_verses' })
export class ScriptureVerse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  reference: string;

  @Column({ name: 'reference_en', type: 'varchar', length: 150, nullable: true })
  referenceEn: string | null;

  @Column({ type: 'text' })
  textVi: string;

  @Column({ type: 'text', nullable: true })
  textEn: string | null;

  @Column({
    name: 'default_translation',
    type: 'enum',
    enum: BibleTranslation,
    default: BibleTranslation.RVV11,
  })
  defaultTranslation: BibleTranslation;

  @Column({
    type: 'enum',
    enum: ScriptureTopic,
    default: ScriptureTopic.Faith,
  })
  topic: ScriptureTopic;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
