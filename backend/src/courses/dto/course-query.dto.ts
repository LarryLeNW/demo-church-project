import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CourseCategory, CourseLanguage } from '../enums/course.enums.js';

export class CourseQueryDto {
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

  @ApiPropertyOptional({ description: 'Tìm theo tiêu đề, giảng viên hoặc mô tả' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CourseCategory })
  @IsOptional()
  @IsEnum(CourseCategory)
  category?: CourseCategory;

  @ApiPropertyOptional({ enum: CourseLanguage })
  @IsOptional()
  @IsEnum(CourseLanguage)
  language?: CourseLanguage;
}
