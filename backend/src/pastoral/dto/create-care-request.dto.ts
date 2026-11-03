import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CareType, CareUrgency } from '../enums/pastoral.enums.js';

export class CreateCareRequestDto {
  @IsEnum(CareType, { message: 'Phân loại chăm sóc mục vụ không hợp lệ' })
  requestType: CareType;

  @IsEnum(CareUrgency, { message: 'Mức độ khẩn cấp không hợp lệ' })
  urgency: CareUrgency;

  @IsString()
  @IsNotEmpty({ message: 'Tên tín hữu hoặc người bệnh không được để trống' })
  @MaxLength(150)
  patientOrMemberName: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên bệnh viện hoặc địa chỉ thăm viếng không được để trống' })
  @MaxLength(255)
  hospitalOrAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại liên hệ không được để trống' })
  @MaxLength(30)
  contactPhone: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng cung cấp tình trạng hoặc lý do cần thăm viếng' })
  description: string;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  householdId?: string;
}
