import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateJournalDto {
  @ApiPropertyOptional({ description: 'ID kế hoạch đọc nếu viết theo lộ trình' })
  @IsOptional()
  @IsUUID('4')
  planId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  dayNumber?: number;

  @ApiProperty({ example: 'Giăng 15:1-8', description: 'Phân đoạn Kinh Thánh đọc hôm nay' })
  @IsString()
  @IsNotEmpty({ message: 'Phân đoạn Kinh Thánh không được để trống' })
  passage: string;

  @ApiProperty({ example: 'Cứ Ở Trong Gốc Nho' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề nhật ký tĩnh nguyện không được để trống' })
  title: string;

  @ApiProperty({
    example:
      'S - Scripture: "Ai cứ ở trong Ta và Ta trong người ấy thì sinh ra nhiều quả; vì ngoài Ta các ngươi chẳng làm chi được."',
  })
  @IsString()
  @IsNotEmpty({ message: 'Câu Lời Chúa phán (Rhema Word) không được để trống' })
  rhemaWord: string;

  @ApiProperty({
    example:
      'O - Observation: Chúa Jesus là cội nguồn của mọi sức sống tâm linh. Nhánh nho tách khỏi gốc sẽ khô héo và vô dụng.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phần quan sát (Observation) không được để trống' })
  observation: string;

  @ApiProperty({
    example:
      'A - Application: Dành 15 phút đầu ngày tĩnh nguyện trước khi mở điện thoại hay email làm việc.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phần áp dụng (Application) không được để trống' })
  application: string;

  @ApiProperty({
    example:
      'P - Prayer: Lạy Chúa Jesus, xin giữ lòng con luôn kết hiệp mật thiết với Ngài mỗi phút giây. Amen.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phần cầu nguyện (Prayer) không được để trống' })
  prayer: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
