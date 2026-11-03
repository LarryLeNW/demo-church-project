import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'Vui lòng chọn phòng cần đặt' })
  @IsString()
  roomId: string;

  @IsNotEmpty({ message: 'Vui lòng nhập tên buổi sinh hoạt / sự kiện' })
  @IsString()
  eventName: string;

  @IsNotEmpty({ message: 'Vui lòng nhập tên ban ngành hoặc nhóm nhỏ' })
  @IsString()
  ministryName: string;

  @IsOptional()
  @IsString()
  campusId?: string;

  @IsNotEmpty({ message: 'Vui lòng chọn thời gian bắt đầu' })
  @IsString()
  startTime: string;

  @IsNotEmpty({ message: 'Vui lòng chọn thời gian kết thúc' })
  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  setupNotes?: string;
}
