import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  BibleTranslation,
  MemoryStatus,
  ScriptureTopic,
} from '../enums/scripture.enums.js';

export class ScriptureQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({ default: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit = 30;

  @ApiPropertyOptional({ description: 'Chỉ lấy những câu gốc đến hạn ôn tập hôm nay' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  dueOnly?: boolean;

  @ApiPropertyOptional({ enum: ScriptureTopic })
  @IsOptional()
  @IsEnum(ScriptureTopic)
  topic?: ScriptureTopic;

  @ApiPropertyOptional({ enum: MemoryStatus })
  @IsOptional()
  @IsEnum(MemoryStatus)
  status?: MemoryStatus;

  @ApiPropertyOptional({ enum: BibleTranslation })
  @IsOptional()
  @IsEnum(BibleTranslation)
  translation?: BibleTranslation;
}
