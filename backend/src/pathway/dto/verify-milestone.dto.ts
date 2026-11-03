import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaptismStatus, SpiritualStage } from '../enums/pathway.enums.js';

export class VerifyMilestoneDto {
  @IsEnum(SpiritualStage, { message: 'Giai đoạn thuộc linh không hợp lệ' })
  stage: SpiritualStage;

  @IsOptional()
  @IsEnum(BaptismStatus, { message: 'Trạng thái báp-têm không hợp lệ' })
  baptismStatus?: BaptismStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày hoàn thành lớp báp-têm phải theo định dạng YYYY-MM-DD' })
  baptismClassCompletedAt?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày báp-têm phải theo định dạng YYYY-MM-DD' })
  baptismDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  baptizedBy?: string;

  @IsOptional()
  @IsBoolean()
  communionEligible?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Ghi chú mục vụ không vượt quá 2000 ký tự' })
  pastoralNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  mentorName?: string;
}
