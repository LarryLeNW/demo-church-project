import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { HouseholdMember } from '../entities/household.entity.js';

export class CreateHouseholdDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên hộ gia đình không được để trống' })
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại gia đình không được để trống' })
  @MaxLength(30)
  primaryPhone: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ nhà không được để trống' })
  @MaxLength(255)
  addressLine1: string;

  @IsString()
  @IsNotEmpty({ message: 'Thành phố không được để trống' })
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'Tiểu bang không được để trống' })
  @MaxLength(20)
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã bưu điện (Zipcode) không được để trống' })
  @MaxLength(20)
  zipcode: string;

  @IsOptional()
  @IsString()
  weddingAnniversary?: string;

  @IsOptional()
  @IsArray()
  members?: HouseholdMember[];

  @IsOptional()
  @IsString()
  notes?: string;
}
