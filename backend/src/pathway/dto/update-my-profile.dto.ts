import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsDateString({}, { message: 'Ngày tiếp nhận Chúa phải theo định dạng YYYY-MM-DD' })
  salvationDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000, { message: 'Lời chứng không vượt quá 3000 ký tự' })
  salvationTestimony?: string;

  @IsOptional()
  @IsBoolean()
  enrollInBaptismClass?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Tên người kèm cặp không quá 150 ký tự' })
  mentorName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  campusId?: string;
}
