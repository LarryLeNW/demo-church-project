import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  BibleTranslation,
  ScriptureTopic,
} from '../enums/scripture.enums.js';

export class AddMemoryVerseDto {
  @ApiPropertyOptional({ description: 'ID câu gốc từ danh mục thư viện' })
  @IsOptional()
  @IsUUID('4')
  verseId?: string;

  @ApiProperty({ example: 'Giăng 3:16' })
  @IsString()
  @IsNotEmpty({ message: 'Phân đoạn Kinh Thánh không được để trống' })
  reference: string;

  @ApiProperty({
    example:
      'Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung câu gốc không được để trống' })
  text: string;

  @ApiPropertyOptional({
    enum: BibleTranslation,
    default: BibleTranslation.RVV11,
  })
  @IsOptional()
  @IsEnum(BibleTranslation)
  translation?: BibleTranslation;

  @ApiPropertyOptional({
    enum: ScriptureTopic,
    default: ScriptureTopic.Salvation,
  })
  @IsOptional()
  @IsEnum(ScriptureTopic)
  topic?: ScriptureTopic;
}
