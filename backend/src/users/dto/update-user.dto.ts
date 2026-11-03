import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum.js';

export class UpdateRoleDto {
  @ApiPropertyOptional({ enum: Role, example: Role.MinistryLeader })
  @IsEnum(Role, { message: 'Vai trò người dùng không hợp lệ' })
  role: Role;
}

export class UpdateStatusDto {
  @ApiPropertyOptional({ example: false })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean (true/false)' })
  isActive: boolean;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '0912345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
