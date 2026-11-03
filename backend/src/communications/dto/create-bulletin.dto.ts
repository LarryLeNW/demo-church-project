import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type {
  BulletinAnnouncement,
  OrderOfServiceItem,
} from '../entities/church-bulletin.entity.js';

export class CreateBulletinDto {
  @ApiProperty({
    example: 'Bản Tin Thờ Phượng Chúa Nhật — Tuần Lễ Ân Điển',
    description: 'Tiêu đề bản tin tuần',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: '2026-03-15',
    description: 'Ngày Chúa Nhật của bản tin (YYYY-MM-DD)',
  })
  @IsDateString()
  bulletinDate: string;

  @ApiProperty({
    example: 'Giăng 15:5 — "Ta là gốc nho, các ngươi là nhánh..."',
    description: 'Câu gốc chủ đề của tuần',
  })
  @IsString()
  @IsNotEmpty()
  themeScripture: string;

  @ApiProperty({
    example: 'Cứ Ở Trong Đấng Christ Để Kết Quả',
    description: 'Tựa đề bài giảng Chúa Nhật',
  })
  @IsString()
  @IsNotEmpty()
  sermonTitle: string;

  @ApiProperty({
    example: 'Mục Sư Quản Nhiệm Rev. Barnabas Nguyen',
    description: 'Người giảng luận',
  })
  @IsString()
  @IsNotEmpty()
  preacherName: string;

  @ApiProperty({
    description: 'Chương trình lễ thờ phượng (Order of Service)',
  })
  @IsArray()
  orderOfService: OrderOfServiceItem[];

  @ApiProperty({
    description: 'Các thông báo mục vụ trong tuần',
  })
  @IsArray()
  announcements: BulletinAnnouncement[];

  @ApiProperty({
    example: 'Cầu thay cho chuyến thăm viếng tân tín hữu và ban thiếu nhi.',
    description: 'Trọng tâm cầu thay tuần này',
  })
  @IsString()
  @IsNotEmpty()
  prayerFocus: string;

  @ApiPropertyOptional({
    example: 'Tổng dâng hiến Chúa Nhật tuần trước: $5,240.00 / Mục tiêu: $5,000.00.',
    description: 'Cập nhật tài chính tóm tắt',
  })
  @IsOptional()
  @IsString()
  financialUpdate?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
