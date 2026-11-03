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
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { RegisterEventDto } from './dto/register-event.dto.js';
import { EventQueryDto } from './dto/event-query.dto.js';

@ApiTags('Church Events & RSVP (Lịch Sự Kiện & Đăng Ký Sinh Hoạt)')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sự kiện sắp diễn ra của Hội Thánh' })
  @ApiResponse({ status: 200, description: 'Danh sách sự kiện được lọc theo campus và danh mục' })
  findAll(@Query() query: EventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get('my/registrations')
  @ApiOperation({ summary: 'Lấy danh sách các sự kiện tôi đã đăng ký tham gia' })
  @ApiResponse({ status: 200, description: 'Danh sách đăng ký cá nhân và gia đình' })
  getMyRegistrations(@CurrentUser('id') userId: string) {
    return this.eventsService.getMyRegistrations(userId);
  }

  @Public()
  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Lấy chi tiết một sự kiện theo ID hoặc Slug' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết sự kiện' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.eventsService.findByIdOrSlug(idOrSlug);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Post()
  @ApiOperation({ summary: 'Tạo sự kiện Hội Thánh mới (Mục sư / Ban Trị Sự)' })
  @ApiResponse({ status: 201, description: 'Sự kiện được khởi tạo thành công' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sự kiện' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Delete(':id')
  @ApiOperation({ summary: 'Hủy / Xóa sự kiện' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Tín hữu đăng ký tham gia sự kiện (RSVP)' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  register(
    @Param('id') eventId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RegisterEventDto,
  ) {
    return this.eventsService.registerForEvent(eventId, userId, dto);
  }

  @Delete('registrations/:regId')
  @ApiOperation({ summary: 'Hủy phiếu đăng ký tham gia của tôi' })
  @ApiResponse({ status: 200, description: 'Hủy đăng ký thành công' })
  cancelRegistration(
    @Param('regId') regId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.cancelRegistration(regId, userId);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get(':id/attendees')
  @ApiOperation({ summary: 'Mục sư xem danh sách đăng ký tham dự sự kiện' })
  @ApiResponse({ status: 200, description: 'Danh sách người tham dự (Attendees roster)' })
  getAttendees(@Param('id') eventId: string) {
    return this.eventsService.getAttendees(eventId);
  }
}
