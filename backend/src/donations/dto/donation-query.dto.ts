import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { DonationStatus, FundType } from '../enums/donation.enums.js';

export class DonationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit = 20;

  @ApiPropertyOptional({ enum: FundType })
  @IsOptional()
  @IsEnum(FundType)
  fundType?: FundType;

  @ApiPropertyOptional({ enum: DonationStatus })
  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;

  @ApiPropertyOptional({ example: 2026, description: 'Năm tính thuế IRS 501(c)(3)' })
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  @Max(2035)
  @IsOptional()
  year?: number;
}
