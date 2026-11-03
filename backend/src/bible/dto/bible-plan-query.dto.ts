import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PlanCategory } from '../enums/bible.enums.js';

export class BiblePlanQueryDto {
  @ApiPropertyOptional({ enum: PlanCategory })
  @IsOptional()
  @IsEnum(PlanCategory)
  category?: PlanCategory;

  @ApiPropertyOptional({ description: 'Tìm theo tiêu đề hoặc mô tả kế hoạch' })
  @IsOptional()
  @IsString()
  search?: string;
}
