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
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { PathwayService } from './pathway.service.js';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto.js';
import { VerifyMilestoneDto } from './dto/verify-milestone.dto.js';
import { PathwayQueryDto } from './dto/pathway-query.dto.js';

@ApiTags('Spiritual Milestones & Faith Pathway (Hành Trình Môn Đồ Hóa & Báp-têm)')
@ApiBearerAuth()
@Controller('pathway')
export class PathwayController {
  constructor(private readonly pathwayService: PathwayService) {}

  @Get('my-profile')
  @ApiOperation({ summary: 'Lấy hồ sơ thuộc linh & lộ trình đức tin của tôi' })
  @ApiResponse({ status: 200, description: 'Hồ sơ môn đồ hóa kèm metadata cột mốc' })
  getMyProfile(@CurrentUser() user: { id: string; role: Role; fullName: string; campusId?: string }) {
    return this.pathwayService.getMyProfileWithMeta(user);
  }

  @Patch('my-profile')
  @ApiOperation({ summary: 'Cập nhật lời chứng, ngày tin Chúa, hoặc đăng ký lớp báp-têm' })
  @ApiResponse({ status: 200, description: 'Cập nhật hồ sơ thành công' })
  updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.pathwayService.updateMyProfile(userId, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('admin/overview')
  @ApiOperation({ summary: 'Xem thống kê toàn Hội Thánh theo các giai đoạn thuộc linh' })
  @ApiResponse({ status: 200, description: 'Dữ liệu tổng quan pipeline môn đồ hóa' })
  getOverview(@Query('campusId') campusId?: string) {
    return this.pathwayService.adminGetOverview(campusId);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('admin/candidates')
  @ApiOperation({ summary: 'Xem danh sách ứng viên Báp-têm, Tân tín hữu và Môn đồ' })
  @ApiResponse({ status: 200, description: 'Danh sách hồ sơ thuộc linh' })
  getCandidates(@Query() query: PathwayQueryDto) {
    return this.pathwayService.adminGetCandidates(query);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Patch('admin/verify/:userId')
  @ApiOperation({ summary: 'Mục sư xác nhận chứng nhận cột mốc Báp-têm hoặc chuyển giai đoạn' })
  @ApiResponse({ status: 200, description: 'Cột mốc được xác nhận thành công' })
  verifyMilestone(
    @Param('userId') userId: string,
    @Body() dto: VerifyMilestoneDto,
    @CurrentUser('fullName') verifiedByName: string,
  ) {
    return this.pathwayService.adminVerifyMilestone(
      userId,
      dto,
      verifiedByName || 'Mục Sư Quản Nhiệm',
    );
  }
}
