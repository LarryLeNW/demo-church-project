import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CheckinChildrenDto {
  @ApiProperty({
    example: ['child-uuid-1', 'child-uuid-2'],
    description: 'Danh sách ID các bé cần điểm danh check-in buổi nhóm hôm nay',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  childIds: string[];
}
