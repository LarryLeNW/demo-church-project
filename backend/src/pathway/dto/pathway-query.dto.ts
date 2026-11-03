import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaptismStatus, SpiritualStage } from '../enums/pathway.enums.js';

export class PathwayQueryDto {
  @IsOptional()
  @IsEnum(SpiritualStage)
  stage?: SpiritualStage;

  @IsOptional()
  @IsEnum(BaptismStatus)
  baptismStatus?: BaptismStatus;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
