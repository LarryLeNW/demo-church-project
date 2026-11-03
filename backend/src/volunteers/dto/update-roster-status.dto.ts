import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RosterStatus } from '../enums/volunteer.enums.js';

export class UpdateRosterStatusDto {
  @IsEnum(RosterStatus, { message: 'Trạng thái ca trực không hợp lệ' })
  status: RosterStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  declineReason?: string;

  @IsOptional()
  @IsString()
  swapTargetUserId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  swapNotes?: string;
}
