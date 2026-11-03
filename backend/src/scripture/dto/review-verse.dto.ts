import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ReviewVerseDto {
  @ApiProperty({
    example: 4,
    description:
      'Đánh giá SM-2 (0-2: Quên/Cần ôn lại, 3: Nhớ nhưng còn ngập ngừng, 4: Nhớ tốt, 5: Thuộc nhuần nhuyễn)',
  })
  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;
}
