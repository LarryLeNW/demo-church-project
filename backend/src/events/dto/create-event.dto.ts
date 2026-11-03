import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EventCategory } from '../enums/event.enums.js';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề sự kiện không được để trống' })
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề tiếng Anh không được để trống' })
  @MaxLength(200)
  titleEn: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EventCategory, { message: 'Phân loại sự kiện không hợp lệ' })
  category: EventCategory;

  @IsString()
  @IsNotEmpty({ message: 'Điểm nhóm tổ chức không được để trống' })
  campusId: string;

  @IsString()
  @IsNotEmpty({ message: 'Thời gian bắt đầu không được để trống' })
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa điểm tổ chức không được để trống' })
  @MaxLength(255)
  location: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsBoolean()
  requiresRegistration?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttendees?: number;

  @IsOptional()
  @IsString()
  registrationDeadline?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
