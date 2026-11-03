import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { VolunteersService } from './volunteers.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { AssignRosterDto } from './dto/assign-roster.dto.js';
import { UpdateRosterStatusDto } from './dto/update-roster-status.dto.js';
import { JoinTeamDto } from './dto/join-team.dto.js';
import { RosterQueryDto } from './dto/roster-query.dto.js';
import { BackgroundCheckStatus } from './enums/volunteer.enums.js';

@ApiTags('Ministry Rostering & Volunteer Operations (Phụng Vụ & Lịch Trực Chúa Nhật)')
@ApiBearerAuth()
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Get('teams')
  @ApiOperation({ summary: 'Lấy danh sách các ban ngành phụng vụ của Hội Thánh' })
  @ApiResponse({ status: 200, description: 'Danh sách ban mục vụ kèm số lượng nhân sự' })
  getTeams(@Query('campusId') campusId?: string) {
    return this.volunteersService.getTeams(campusId);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Post('teams')
  @ApiOperation({ summary: 'Tạo ban mục vụ mới (Mục sư / Ban Trị Sự)' })
  @ApiResponse({ status: 201, description: 'Ban mục vụ khởi tạo thành công' })
  createTeam(@Body() dto: CreateTeamDto) {
    return this.volunteersService.createTeam(dto);
  }

  @Post('join-team')
  @ApiOperation({ summary: 'Tín hữu nộp đơn đăng ký tham gia ban phụng vụ' })
  @ApiResponse({ status: 201, description: 'Đăng ký tham gia ban phụng vụ thành công' })
  joinTeam(@CurrentUser('id') userId: string, @Body() dto: JoinTeamDto) {
    return this.volunteersService.joinTeam(userId, dto);
  }

  @Get('my-schedule')
  @ApiOperation({ summary: 'Lấy lịch phục vụ Chúa Nhật của cá nhân tôi' })
  @ApiResponse({ status: 200, description: 'Danh sách ca trực sắp tới và lịch sử' })
  getMySchedule(@CurrentUser('id') userId: string) {
    return this.volunteersService.getMySchedule(userId);
  }

  @Patch('roster/:id/status')
  @ApiOperation({ summary: 'Tín hữu xác nhận (Confirm), từ chối (Decline), hoặc yêu cầu đổi ca (Swap)' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái ca trực thành công' })
  updateMyRosterStatus(
    @Param('id') rosterId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateRosterStatusDto,
  ) {
    return this.volunteersService.updateMyRosterStatus(rosterId, userId, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('roster')
  @ApiOperation({ summary: 'Mục sư / Trưởng ban xem bảng phân công ca trực Chúa Nhật' })
  @ApiResponse({ status: 200, description: 'Toàn bộ danh sách phân công và tỷ lệ xác nhận' })
  getRosterOverview(@Query() query: RosterQueryDto) {
    return this.volunteersService.getRosterOverview(query);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Post('roster/assign')
  @ApiOperation({ summary: 'Phân công nhân sự vào vị trí phụng vụ Chúa Nhật' })
  @ApiResponse({ status: 201, description: 'Phân công ca trực thành công' })
  assignRoster(@Body() dto: AssignRosterDto) {
    return this.volunteersService.assignRoster(dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Delete('roster/:id')
  @ApiOperation({ summary: 'Xóa vị trí phân công ca trực' })
  @ApiResponse({ status: 200, description: 'Xóa ca trực thành công' })
  removeRoster(@Param('id') rosterId: string) {
    return this.volunteersService.removeRoster(rosterId);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Patch('clearance/:memberId')
  @ApiOperation({ summary: 'Cập nhật trạng thái an toàn lý lịch tình nguyện viên (Child Safety)' })
  @ApiResponse({ status: 200, description: 'Cập nhật kiểm tra an toàn thành công' })
  updateClearance(
    @Param('memberId') memberId: string,
    @Body('status') status: BackgroundCheckStatus,
  ) {
    return this.volunteersService.updateClearance(memberId, status);
  }
}
