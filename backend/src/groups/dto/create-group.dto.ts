import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GroupCategory } from '../enums/group.enums.js';

export class CreateGroupDto {
  @ApiProperty({ example: 'Nhóm Gia Đình Trẻ Dallas' })
  @IsString()
  @IsNotEmpty({ message: 'Tên nhóm không được để trống' })
  name: string;

  @ApiProperty({ description: 'ID của Trưởng nhóm', example: 'uuid-string' })
  @IsUUID('4', { message: 'ID trưởng nhóm không hợp lệ' })
  leaderId: string;

  @ApiPropertyOptional({ enum: GroupCategory, default: GroupCategory.Families })
  @IsOptional()
  @IsEnum(GroupCategory)
  category?: GroupCategory;

  @ApiProperty({ example: 'Thứ Sáu 19:30' })
  @IsString()
  @IsNotEmpty({ message: 'Lịch sinh hoạt không được để trống' })
  scheduleRule: string;

  @ApiPropertyOptional({ example: 'Tư gia Chấp sự Nguyen, Plano, TX' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'https://zoom.us/j/123456789' })
  @IsOptional()
  @IsString()
  zoomLink?: string;

  @ApiPropertyOptional({ example: '75024' })
  @IsOptional()
  @IsString()
  zipcode?: string;

  @ApiPropertyOptional({ example: 'Nhóm thông công học Lời Chúa và nâng đỡ các gia đình trẻ' })
  @IsOptional()
  @IsString()
  description?: string;
}
