import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../enums/facility.enums.js';

export class ReservationQueryDto {
  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  roomId?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsString()
  date?: string; // YYYY-MM-DD
}
