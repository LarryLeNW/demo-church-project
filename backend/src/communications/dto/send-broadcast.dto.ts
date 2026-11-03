import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  CommunicationChannel,
  CommunicationType,
  TargetAudience,
} from '../enums/communication.enums.js';

export class SendBroadcastDto {
  @ApiProperty({
    enum: CommunicationChannel,
    example: CommunicationChannel.SMS,
    description: 'Kênh truyền thông (SMS qua Twilio hoặc Email qua Resend)',
  })
  @IsEnum(CommunicationChannel)
  channel: CommunicationChannel;

  @ApiProperty({
    enum: CommunicationType,
    example: CommunicationType.EmergencyAlert,
    description: 'Loại thông điệp mục vụ',
  })
  @IsEnum(CommunicationType)
  type: CommunicationType;

  @ApiProperty({
    enum: TargetAudience,
    example: TargetAudience.AllMembers,
    description: 'Đối tượng nhận tin',
  })
  @IsEnum(TargetAudience)
  targetAudience: TargetAudience;

  @ApiPropertyOptional({
    description: 'ID của nhóm tế bào cụ thể nếu targetAudience = specific_group',
  })
  @IsOptional()
  @IsString()
  targetGroupId?: string;

  @ApiProperty({
    example: 'THÔNG BÁO KHẨN: HỦY BUỔI NHÓM DO BÃO TUYẾT',
    description: 'Tiêu đề thông báo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example:
      'Kính gửi Hội Thánh, do thời tiết đóng băng nguy hiểm tại Dallas, buổi nhóm tối nay chuyển sang trực tuyến qua Zoom lúc 19:30. Kính xin quý tín hữu ở nhà an toàn!',
    description: 'Nội dung thông điệp (SMS tối đa 320 ký tự, Email định dạng văn bản đầy đủ)',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
