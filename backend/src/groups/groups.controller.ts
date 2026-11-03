import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { AddGroupMemberDto } from './dto/group-member.dto.js';
import { BatchAttendanceDto } from './dto/batch-attendance.dto.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { GroupQueryDto } from './dto/group-query.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { GroupsService } from './groups.service.js';

@ApiTags('Small Groups & Life Groups (Nhóm Tế Bào)')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách các nhóm tế bào (tìm theo Zipcode, độ tuổi)' })
  @ApiResponse({ status: 200, description: 'Danh sách nhóm nhỏ' })
  findAll(@Query() query: GroupQueryDto) {
    return this.groupsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết nhóm nhỏ và thông tin sinh hoạt' })
  @ApiResponse({ status: 200, description: 'Chi tiết nhóm' })
  findById(@Param('id') id: string) {
    return this.groupsService.findById(id);
  }

  @Post()
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Tạo nhóm tế bào mới' })
  @ApiResponse({ status: 201, description: 'Nhóm nhỏ đã tạo' })
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Cập nhật thông tin nhóm tế bào' })
  @ApiResponse({ status: 200, description: 'Nhóm nhỏ đã cập nhật' })
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Lấy danh sách thành viên trong nhóm' })
  @ApiResponse({ status: 200, description: 'Danh sách thành viên' })
  getMembers(@Param('id') id: string) {
    return this.groupsService.getMembers(id);
  }

  @Post(':id/members')
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Thêm tín hữu vào nhóm tế bào' })
  @ApiResponse({ status: 201, description: 'Đã thêm thành viên' })
  addMember(@Param('id') id: string, @Body() dto: AddGroupMemberDto) {
    return this.groupsService.addMember(id, dto);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Xóa tín hữu khỏi nhóm tế bào' })
  @ApiResponse({ status: 204, description: 'Đã xóa thành viên' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.groupsService.removeMember(id, userId);
  }

  @Post(':id/attendance')
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Điểm danh buổi sinh hoạt nhóm hàng loạt' })
  @ApiResponse({ status: 201, description: 'Đã lưu kết quả điểm danh' })
  recordAttendance(
    @Param('id') id: string,
    @CurrentUser('id') markedById: string,
    @Body() dto: BatchAttendanceDto,
  ) {
    return this.groupsService.recordAttendance(id, markedById, dto);
  }

  @Get(':id/attendance')
  @ApiOperation({ summary: 'Xem lịch sử điểm danh của nhóm nhỏ' })
  @ApiResponse({ status: 200, description: 'Lịch sử điểm danh' })
  getAttendanceHistory(
    @Param('id') id: string,
    @Query('sessionDate') sessionDate?: string,
  ) {
    return this.groupsService.getAttendanceHistory(id, sessionDate);
  }
}
