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
import { PrayerRequest } from './prayer-request.entity.js';

@Entity({ name: 'prayer_intercessions' })
@Index(['prayerRequestId', 'userId'], { unique: true })
export class PrayerIntercession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'prayer_request_id', type: 'varchar', length: 36 })
  prayerRequestId: string;

  @ManyToOne(() => PrayerRequest, (pr) => pr.intercessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prayer_request_id' })
  prayerRequest: Relation<PrayerRequest>;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @CreateDateColumn({ name: 'prayed_at', type: 'datetime' })
  prayedAt: Date;
}
