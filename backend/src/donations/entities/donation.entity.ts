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
  DonationFrequency,
  DonationStatus,
  FundType,
  PaymentMethodType,
} from '../enums/donation.enums.js';

@Entity({ name: 'donations' })
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36, nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User> | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({
    name: 'fund_type',
    type: 'enum',
    enum: FundType,
    default: FundType.Tithes,
  })
  fundType: FundType;

  @Column({
    type: 'enum',
    enum: DonationFrequency,
    default: DonationFrequency.OneTime,
  })
  frequency: DonationFrequency;

  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.Pending,
  })
  status: DonationStatus;

  @Column({
    name: 'payment_method_type',
    type: 'enum',
    enum: PaymentMethodType,
    default: PaymentMethodType.Card,
  })
  paymentMethodType: PaymentMethodType;

  @Index()
  @Column({
    name: 'stripe_payment_intent_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripePaymentIntentId: string | null;

  @Index()
  @Column({
    name: 'stripe_subscription_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripeSubscriptionId: string | null;

  @Column({
    name: 'stripe_customer_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripeCustomerId: string | null;

  @Column({ name: 'donor_name', type: 'varchar', length: 150 })
  donorName: string;

  @Index()
  @Column({ name: 'donor_email', type: 'varchar', length: 190 })
  donorEmail: string;

  @Column({ name: 'donor_address', type: 'varchar', length: 255, nullable: true })
  donorAddress: string | null;

  @Index()
  @Column({
    name: 'receipt_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  receiptNumber: string | null;

  @Column({ name: 'tax_deductible', type: 'boolean', default: true })
  taxDeductible: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
