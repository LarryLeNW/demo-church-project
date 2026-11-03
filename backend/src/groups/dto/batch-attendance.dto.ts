import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../enums/group.enums.js';

export class AttendanceRecordItemDto {
  @ApiProperty({ example: 'uuid-string' })
  @IsUUID('4')
  userId: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.Present })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional({ example: 'Có mặt đúng giờ' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BatchAttendanceDto {
  @ApiProperty({ example: '2026-11-06', description: 'Ngày sinh hoạt nhóm (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Ngày điểm danh không hợp lệ (định dạng YYYY-MM-DD)' })
  sessionDate: string;

  @ApiProperty({ type: [AttendanceRecordItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordItemDto)
  records: AttendanceRecordItemDto[];
}
