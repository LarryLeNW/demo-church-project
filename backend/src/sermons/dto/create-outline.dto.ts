import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { OutlinePoint } from '../interfaces/sermon.interface.js';

export class CreateOutlineDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề bài giảng không được để trống' })
  @MaxLength(220)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề tiếng Anh không được để trống' })
  @MaxLength(220)
  titleEn: string;

  @IsOptional()
  @IsString()
  seriesName?: string;

  @IsOptional()
  @IsString()
  preacherName?: string;

  @IsString()
  @IsNotEmpty({ message: 'Ngày giảng không được để trống' })
  serviceDate: string;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Câu gốc chủ đề không được để trống' })
  mainScriptureRef: string;

  @IsString()
  @IsNotEmpty({ message: 'Lời câu gốc tiếng Việt không được để trống' })
  mainScriptureTextVi: string;

  @IsString()
  @IsNotEmpty({ message: 'Lời câu gốc tiếng Anh không được để trống' })
  mainScriptureTextEn: string;

  @IsArray()
  outlinePoints: OutlinePoint[];

  @IsOptional()
  @IsArray()
  discussionQuestions?: string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
