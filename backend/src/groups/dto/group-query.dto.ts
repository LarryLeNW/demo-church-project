import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { GroupCategory } from '../enums/group.enums.js';

export class GroupQueryDto {
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

  @ApiPropertyOptional({ description: 'Tìm theo tên nhóm, địa điểm hoặc zipcode' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: GroupCategory })
  @IsOptional()
  @IsEnum(GroupCategory)
  category?: GroupCategory;

  @ApiPropertyOptional({ example: '75024' })
  @IsOptional()
  @IsString()
  zipcode?: string;
}
