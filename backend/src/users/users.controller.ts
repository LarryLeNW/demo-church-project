import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { UpdateRoleDto, UpdateStatusDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('Church Members & Staff')
@ApiBearerAuth()
@Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tín hữu & nhân sự phân trang' })
  @ApiResponse({ status: 200, description: 'Danh sách tín hữu' })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết tín hữu theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết tín hữu' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @Roles(Role.Admin, Role.SeniorPastor)
  @ApiOperation({ summary: 'Cập nhật vai trò mục vụ (Chỉ Mục sư / Admin)' })
  @ApiResponse({ status: 200, description: 'Vai trò đã cập nhật' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Patch(':id/status')
  @Roles(Role.Admin, Role.SeniorPastor)
  @ApiOperation({ summary: 'Khóa hoặc mở khóa tài khoản tín hữu' })
  @ApiResponse({ status: 200, description: 'Trạng thái đã cập nhật' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.usersService.updateStatus(id, dto.isActive);
  }
}
