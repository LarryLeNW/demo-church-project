import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { DonationFrequency, FundType } from '../enums/donation.enums.js';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 200, description: 'Số tiền dâng hiến định kỳ (USD)' })
  @IsNumber()
  @IsPositive()
  @Min(5, { message: 'Số tiền dâng định kỳ tối thiểu là $5 USD' })
  amount: number;

  @ApiProperty({ enum: FundType, default: FundType.Tithes })
  @IsEnum(FundType)
  fundType: FundType;

  @ApiProperty({
    enum: [DonationFrequency.Weekly, DonationFrequency.Monthly],
    default: DonationFrequency.Monthly,
    description: 'Chu kỳ dâng hiến (Hàng tuần hoặc Hàng tháng)',
  })
  @IsEnum(DonationFrequency)
  frequency: DonationFrequency;

  @ApiProperty({ example: 'John Tran' })
  @IsString()
  @IsNotEmpty()
  donorName: string;

  @ApiProperty({ example: 'johntran@example.com' })
  @IsEmail()
  donorEmail: string;

  @ApiPropertyOptional({ example: '1234 Preston Rd, Plano, TX 75024' })
  @IsOptional()
  @IsString()
  donorAddress?: string;

  @ApiProperty({ example: 'pm_card_visa', description: 'Stripe Payment Method ID' })
  @IsString()
  @IsNotEmpty({ message: 'Cần có Payment Method ID từ Stripe' })
  paymentMethodId: string;
}
