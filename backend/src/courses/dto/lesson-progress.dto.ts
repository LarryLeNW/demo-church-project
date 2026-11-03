import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SaveLessonProgressDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    example: 'Ghi chú bài học: Cần cầu nguyện hằng ngày vào mỗi sáng sớm để tương giao cùng Chúa.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
