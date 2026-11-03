import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AssignRosterDto {
  @IsDateString({}, { message: 'Ngày phụng vụ phải có định dạng YYYY-MM-DD' })
  serviceDate: string;

  @IsOptional()
  @IsString()
  serviceTitle?: string;

  @IsString()
  @IsNotEmpty({ message: 'Điểm nhóm không được để trống' })
  campusId: string;

  @IsString()
  @IsNotEmpty({ message: 'Ban mục vụ không được để trống' })
  teamId: string;

  @IsString()
  @IsNotEmpty({ message: 'Tín hữu được phân công không được để trống' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Vị trí phụng vụ không được để trống' })
  @MaxLength(150)
  roleTitle: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
