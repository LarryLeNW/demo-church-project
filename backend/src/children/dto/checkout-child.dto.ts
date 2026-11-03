import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutChildDto {
  @ApiProperty({
    example: 'G-7429',
    description: 'Mã an toàn bảo mật trên vé đón của phụ huynh',
  })
  @IsString()
  @IsNotEmpty()
  securityCode: string;
}
