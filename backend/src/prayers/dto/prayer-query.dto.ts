import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PrayerCategory } from '../enums/prayer.enums.js';

export class PrayerQueryDto {
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

  @ApiPropertyOptional({ enum: PrayerCategory })
  @IsOptional()
  @IsEnum(PrayerCategory)
  category?: PrayerCategory;

  @ApiPropertyOptional({ description: 'Lọc các lời cầu nguyện đã được Chúa nhậm lời' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAnswered?: boolean;

  @ApiPropertyOptional({ description: 'Tìm theo tiêu đề hoặc nội dung' })
  @IsOptional()
  @IsString()
  search?: string;
}
