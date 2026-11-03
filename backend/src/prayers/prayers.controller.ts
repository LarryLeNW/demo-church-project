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
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { CreatePrayerDto } from './dto/create-prayer.dto.js';
import { LogPastoralVisitDto } from './dto/log-pastoral-visit.dto.js';
import { PrayerQueryDto } from './dto/prayer-query.dto.js';
import { RecordTestimonyDto } from './dto/record-testimony.dto.js';
import { PrayersService } from './prayers.service.js';

@ApiTags('Prayer Sanctuary & Pastoral Care (Tường Cầu Thay & Thăm Viếng Mục Vụ)')
@ApiBearerAuth()
@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách các lời cầu thay trên Tường Cầu Nguyện' })
  @ApiResponse({ status: 200, description: 'Danh sách lời cầu thay' })
  findAll(@CurrentUser() user: User | null, @Query() query: PrayerQueryDto) {
    return this.prayersService.findAll(user, query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết lời cầu thay' })
  @ApiResponse({ status: 200, description: 'Chi tiết lời cầu thay' })
  findById(@Param('id') id: string, @CurrentUser() user: User | null) {
    return this.prayersService.findById(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Gửi lời cầu thay mới lên Hội Thánh' })
  @ApiResponse({ status: 201, description: 'Lời cầu thay đã tạo' })
  create(@CurrentUser() user: User, @Body() dto: CreatePrayerDto) {
    return this.prayersService.create(user, dto);
  }

  @Post(':id/intercede')
  @ApiOperation({ summary: 'Bấm nút "Tôi Đang Hiệp Nguyện" cầu thay cho tín hữu' })
  @ApiResponse({ status: 200, description: 'Đã hiệp ý cầu thay' })
  intercede(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.prayersService.intercede(id, userId);
  }

  @Patch(':id/testimony')
  @ApiOperation({ summary: 'Đánh dấu Chúa đã nhậm lời và ghi nhận lời chứng tạ ơn (Praise Report)' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật lời chứng tạ ơn' })
  recordTestimony(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: RecordTestimonyDto,
  ) {
    return this.prayersService.recordTestimony(id, user, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Get('pastoral-care/absentees')
  @ApiOperation({ summary: 'Danh sách tín hữu vắng mặt dài ngày cần Mục sư thăm viếng (Absentee Alerts)' })
  @ApiResponse({ status: 200, description: 'Danh sách cảnh báo vắng mặt' })
  getAbsenteeAlerts() {
    return this.prayersService.getAbsenteeAlerts();
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Post('pastoral-care/log-visit')
  @ApiOperation({ summary: 'Ghi nhận lịch sử gọi điện hoặc thăm viếng tín hữu của Mục sư' })
  @ApiResponse({ status: 201, description: 'Đã lưu nhật ký thăm viếng' })
  logPastoralVisit(
    @CurrentUser('id') pastorId: string,
    @Body() dto: LogPastoralVisitDto,
  ) {
    return this.prayersService.logPastoralVisit(pastorId, dto);
  }
}
