import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../enums/facility.enums.js';

export class ReviewReservationDto {
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái phê duyệt' })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
