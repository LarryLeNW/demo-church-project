import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CourseCategory, CourseLanguage } from '../enums/course.enums.js';

export class CreateCourseDto {
  @ApiProperty({ example: 'Nền Tảng Đời Sống Cơ Đốc' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề khóa học không được để trống' })
  title: string;

  @ApiPropertyOptional({ example: 'nen-tang-doi-song-co-doc' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Khóa học 8 tuần trang bị cho tân tín hữu và người muốn hiểu sâu về Lời Chúa' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ enum: CourseCategory, default: CourseCategory.Discipleship })
  @IsOptional()
  @IsEnum(CourseCategory)
  category?: CourseCategory;

  @ApiPropertyOptional({ enum: CourseLanguage, default: CourseLanguage.Vietnamese })
  @IsOptional()
  @IsEnum(CourseLanguage)
  language?: CourseLanguage;

  @ApiPropertyOptional({ example: 'Mục Sư Quản Nhiệm' })
  @IsOptional()
  @IsString()
  instructorName?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
