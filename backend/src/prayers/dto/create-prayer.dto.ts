import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrayerCategory } from '../enums/prayer.enums.js';

export class CreatePrayerDto {
  @ApiProperty({ example: 'Cầu nguyện cho kỳ mổ tim của Bác David Nguyen' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề lời cầu thay không được để trống' })
  title: string;

  @ApiProperty({
    example:
      'Xin Hội Thánh cùng hiệp ý cầu thay cho Bác David vào thứ Ba tuần sau tại bệnh viện Plano Presbyterian...',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung lời cầu thay không được để trống' })
  content: string;

  @ApiPropertyOptional({ enum: PrayerCategory, default: PrayerCategory.Healing })
  @IsOptional()
  @IsEnum(PrayerCategory)
  category?: PrayerCategory;

  @ApiPropertyOptional({
    default: false,
    description: 'Kín nhiệm: Chỉ Mục sư và Ban Trị Sự được xem',
  })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @ApiPropertyOptional({
    default: false,
    description: 'Ẩn danh: Không hiển thị tên tác giả',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ example: 'Gia đình Bác David' })
  @IsOptional()
  @IsString()
  authorName?: string;
}
