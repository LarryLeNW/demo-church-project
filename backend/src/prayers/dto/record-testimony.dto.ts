import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RecordTestimonyDto {
  @ApiProperty({
    example:
      'Tạ ơn Chúa! Ca mổ đã diễn ra thành công tốt đẹp, bác sĩ cho biết sức khỏe đang phục hồi rất nhanh chóng. Cảm ơn Hội Thánh đã bền lòng cầu thay!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Lời chứng tạ ơn Chúa không được để trống' })
  praiseReport: string;
}
