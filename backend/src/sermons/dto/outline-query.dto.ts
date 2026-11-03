import { IsOptional, IsString } from 'class-validator';

export class OutlineQueryDto {
  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  serviceDate?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
