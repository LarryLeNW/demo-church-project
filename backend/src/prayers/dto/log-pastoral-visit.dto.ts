import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class LogPastoralVisitDto {
  @ApiProperty({ description: 'ID của tín hữu được thăm viếng' })
  @IsUUID('4', { message: 'ID tín hữu không hợp lệ' })
  memberId: string;

  @ApiPropertyOptional({
    example: 'phone',
    description: 'Hình thức liên hệ: phone | in_person | home_visit',
  })
  @IsOptional()
  @IsString()
  contactType?: string;

  @ApiProperty({
    example:
      'Đã gọi điện thăm hỏi. Tín hữu bị cảm cúm vào Chúa Nhật vừa rồi, gia đình bình an và hứa tuần này sẽ đi nhà thờ.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung thăm viếng không được để trống' })
  notes: string;
}
