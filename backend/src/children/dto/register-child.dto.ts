import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Classroom } from '../enums/children.enums.js';

export class RegisterChildDto {
  @ApiProperty({ example: 'Joshua Nguyen', description: 'Họ và tên của bé' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: '2020-05-18', description: 'Ngày sinh của bé (YYYY-MM-DD)' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    enum: Classroom,
    example: Classroom.Elementary,
    description: 'Phòng học / Lớp thiếu nhi',
  })
  @IsEnum(Classroom)
  classroom: Classroom;

  @ApiPropertyOptional({
    example: 'Dị ứng đậu phộng (Peanut Allergy), hen suyễn nhẹ',
    description: 'Thông tin dị ứng và tiền sử bệnh lý (Cảnh báo in màu đỏ trên tem an toàn)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  allergies?: string;

  @ApiPropertyOptional({
    example: 'Bé thích vẽ tranh, nhút nhát trong 10 phút đầu',
    description: 'Lưu ý đặc biệt cho giáo viên Trường Chúa Nhật',
  })
  @IsOptional()
  @IsString()
  specialNotes?: string;

  @ApiProperty({
    example: 'Anh Barnabas Nguyen (Bố)',
    description: 'Người liên hệ khẩn cấp',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  emergencyContactName: string;

  @ApiProperty({
    example: '(214) 555-0199',
    description: 'Số điện thoại khẩn cấp',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  emergencyContactPhone: string;
}
