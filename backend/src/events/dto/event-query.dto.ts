import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EventCategory } from '../enums/event.enums.js';

export class EventQueryDto {
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  upcomingOnly?: string;
}
