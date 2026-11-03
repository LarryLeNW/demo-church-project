import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsQueryDto } from './dto/analytics-query.dto.js';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  async getOverview(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getExecutiveOverview(query.campusId);
  }

  @Get('report/annual')
  @Roles(Role.SeniorPastor, Role.Admin)
  async getAnnualReport(@Query() query: AnalyticsQueryDto) {
    const year = query.year ? parseInt(query.year, 10) : new Date().getFullYear();
    return this.analyticsService.getAnnualExecutiveReport(query.campusId, year);
  }
}
