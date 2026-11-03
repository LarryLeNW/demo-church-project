import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class JoinTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng chọn ban mục vụ muốn tham gia' })
  teamId: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  roleInTeam?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
