import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Bài 1: Sự Tái Sinh và Đời Sống Mới' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề bài học không được để trống' })
  title: string;

  @ApiPropertyOptional({ example: 'bai-1-su-tai-sinh' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 1800, description: 'Thời lượng (giây)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 'Giăng 3:1-16' })
  @IsOptional()
  @IsString()
  scriptureReference?: string;

  @ApiPropertyOptional({ example: 'https://example.com/guides/lesson-1.pdf' })
  @IsOptional()
  @IsString()
  studyGuidePdfUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'Ý nghĩa của sự tái sinh đối với đời sống Cơ Đốc nhân là gì?',
      'Bạn đã từng trải qua khoảnh khắc đầu phục Chúa Jesus như thế nào?',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  discussionQuestions?: string[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
