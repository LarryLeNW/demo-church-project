import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { GroupMemberRole } from '../enums/group.enums.js';

export class AddGroupMemberDto {
  @ApiProperty({ description: 'ID của tín hữu', example: 'uuid-string' })
  @IsUUID('4', { message: 'ID tín hữu không hợp lệ' })
  userId: string;

  @ApiPropertyOptional({ enum: GroupMemberRole, default: GroupMemberRole.Member })
  @IsOptional()
  @IsEnum(GroupMemberRole)
  role?: GroupMemberRole;
}
