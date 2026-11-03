import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleDayCompletionDto {
  @ApiProperty({ example: true, description: 'Trạng thái hoàn thành ngày đọc' })
  @IsBoolean()
  isCompleted: boolean;
}
