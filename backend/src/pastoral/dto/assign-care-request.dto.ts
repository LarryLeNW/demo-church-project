import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignCareRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng chỉ định Mục sư phụ trách' })
  assignedPastorId: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên Mục sư không được để trống' })
  assignedPastorName: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}

export class CompleteCareRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập báo cáo kết quả sau buổi thăm viếng' })
  pastoralReport: string;
}
