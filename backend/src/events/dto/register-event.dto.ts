import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class RegisterEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ tên người đăng ký không được để trống' })
  @MaxLength(150)
  attendeeName: string;

  @IsEmail({}, { message: 'Email liên hệ không hợp lệ' })
  attendeeEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  attendeePhone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  adultCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  childCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  dietaryRestrictions?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
