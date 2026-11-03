import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RosterStatus } from '../enums/volunteer.enums.js';

export class RosterQueryDto {
  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsEnum(RosterStatus)
  status?: RosterStatus;
}
