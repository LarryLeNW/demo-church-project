import {
  Body,
  Controller,
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
import { PastoralService } from './pastoral.service.js';
import { CreateCareRequestDto } from './dto/create-care-request.dto.js';
import { AssignCareRequestDto, CompleteCareRequestDto } from './dto/assign-care-request.dto.js';
import { CreateHouseholdDto } from './dto/create-household.dto.js';
import { CareQueryDto } from './dto/care-query.dto.js';

@ApiTags('Pastoral Care & Family Directory (Chăm Sóc Mục Vụ & Danh Bạ Gia Đình)')
@ApiBearerAuth()
@Controller('pastoral')
export class PastoralController {
  constructor(private readonly pastoralService: PastoralService) {}

  @Post('requests')
  @ApiOperation({ summary: 'Tín hữu gửi yêu cầu Mục sư thăm viếng hoặc cầu nguyện xức dầu' })
  @ApiResponse({ status: 201, description: 'Yêu cầu được chuyển đến Mục sư phụ trách' })
  createRequest(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCareRequestDto,
  ) {
    return this.pastoralService.createCareRequest(userId, dto);
  }

  @Get('my-requests')
  @ApiOperation({ summary: 'Lấy danh sách các yêu cầu chăm sóc mục vụ của tôi' })
  @ApiResponse({ status: 200, description: 'Danh sách yêu cầu cá nhân' })
  getMyRequests(@CurrentUser('id') userId: string) {
    return this.pastoralService.getMyCareRequests(userId);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('overview')
  @ApiOperation({ summary: 'Thống kê tổng quan chăm sóc mục vụ & thăm viếng' })
  @ApiResponse({ status: 200, description: 'Số liệu tổng hợp thăm viếng và gia đình' })
  getOverview(@Query('campusId') campusId?: string) {
    return this.pastoralService.getPastoralOverview(campusId);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('requests')
  @ApiOperation({ summary: 'Xem toàn bộ danh sách yêu cầu chăm sóc mục vụ' })
  @ApiResponse({ status: 200, description: 'Danh sách yêu cầu thăm viếng' })
  getAllRequests(@Query() query: CareQueryDto) {
    return this.pastoralService.getAllCareRequests(query);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Patch('requests/:id/assign')
  @ApiOperation({ summary: 'Chỉ định Mục sư phụ trách và lên lịch giờ thăm viếng' })
  @ApiResponse({ status: 200, description: 'Phân công thành công' })
  assignRequest(
    @Param('id') id: string,
    @Body() dto: AssignCareRequestDto,
  ) {
    return this.pastoralService.assignCareRequest(id, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Patch('requests/:id/complete')
  @ApiOperation({ summary: 'Hoàn tất buổi thăm viếng và ghi báo cáo mục vụ' })
  @ApiResponse({ status: 200, description: 'Ghi báo cáo thành công' })
  completeRequest(
    @Param('id') id: string,
    @Body() dto: CompleteCareRequestDto,
  ) {
    return this.pastoralService.completeCareRequest(id, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('households')
  @ApiOperation({ summary: 'Lấy danh bạ các hộ gia đình trong Hội Thánh' })
  @ApiResponse({ status: 200, description: 'Danh bạ hộ gia đình' })
  getHouseholds(
    @Query('campusId') campusId?: string,
    @Query('search') search?: string,
  ) {
    return this.pastoralService.getHouseholds(campusId, search);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('households/:id')
  @ApiOperation({ summary: 'Xem chi tiết một hộ gia đình và thành viên' })
  @ApiResponse({ status: 200, description: 'Chi tiết gia đình' })
  getHouseholdById(@Param('id') id: string) {
    return this.pastoralService.getHouseholdById(id);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Post('households')
  @ApiOperation({ summary: 'Tạo hồ sơ hộ gia đình mới' })
  @ApiResponse({ status: 201, description: 'Tạo hộ gia đình thành công' })
  createHousehold(@Body() dto: CreateHouseholdDto) {
    return this.pastoralService.createHousehold(dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Patch('households/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin hộ gia đình' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  updateHousehold(
    @Param('id') id: string,
    @Body() dto: Partial<CreateHouseholdDto>,
  ) {
    return this.pastoralService.updateHousehold(id, dto);
  }
}
