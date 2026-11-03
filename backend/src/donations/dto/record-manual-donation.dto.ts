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
import { FundType, PaymentMethodType } from '../enums/donation.enums.js';

export class RecordManualDonationDto {
  @ApiProperty({ example: 'Bà Anna Le' })
  @IsString()
  @IsNotEmpty({ message: 'Tên người dâng không được để trống' })
  donorName: string;

  @ApiPropertyOptional({ example: 'annale@example.com' })
  @IsOptional()
  @IsEmail()
  donorEmail?: string;

  @ApiProperty({ example: 150, description: 'Số tiền dâng hiến (USD)' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: FundType, default: FundType.Tithes })
  @IsEnum(FundType)
  fundType: FundType;

  @ApiProperty({
    enum: [PaymentMethodType.Cash, PaymentMethodType.Check],
    default: PaymentMethodType.Cash,
  })
  @IsEnum(PaymentMethodType)
  paymentMethodType: PaymentMethodType;

  @ApiPropertyOptional({ example: 'Check #1042' })
  @IsOptional()
  @IsString()
  notes?: string;
}
