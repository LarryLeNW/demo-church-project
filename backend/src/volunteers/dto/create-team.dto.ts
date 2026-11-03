import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên ban mục vụ không được để trống' })
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên tiếng Anh không được để trống' })
  @MaxLength(150)
  nameEn: string;

  @IsOptional()
  @IsString()
  leaderId?: string;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  requiredClearance?: boolean;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  iconName?: string;
}
