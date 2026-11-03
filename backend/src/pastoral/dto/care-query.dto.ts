import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CareStatus, CareType, CareUrgency } from '../enums/pastoral.enums.js';

export class CareQueryDto {
  @IsOptional()
  @IsEnum(CareType)
  requestType?: CareType;

  @IsOptional()
  @IsEnum(CareUrgency)
  urgency?: CareUrgency;

  @IsOptional()
  @IsEnum(CareStatus)
  status?: CareStatus;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
