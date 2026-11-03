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

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 100, description: 'Số tiền dâng hiến (USD)' })
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'Số tiền dâng tối thiểu là $1 USD' })
  amount: number;

  @ApiProperty({ enum: FundType, default: FundType.Tithes })
  @IsEnum(FundType)
  fundType: FundType;

  @ApiProperty({ example: 'John Tran', description: 'Tên tín hữu dâng hiến' })
  @IsString()
  @IsNotEmpty({ message: 'Tên người dâng không được để trống' })
  donorName: string;

  @ApiProperty({ example: 'johntran@example.com' })
  @IsEmail({}, { message: 'Email người dâng không hợp lệ' })
  donorEmail: string;

  @ApiPropertyOptional({ example: '1234 Preston Rd, Plano, TX 75024', description: 'Địa chỉ nhận biên nhận thuế IRS 501(c)(3)' })
  @IsOptional()
  @IsString()
  donorAddress?: string;

  @ApiPropertyOptional({ example: 'Dâng tạ ơn Chúa nhân dịp sinh nhật' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: PaymentMethodType, default: PaymentMethodType.Card })
  @IsOptional()
  @IsEnum(PaymentMethodType)
  paymentMethodType?: PaymentMethodType;
}
