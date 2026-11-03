import {
  Body,
  Controller,
  Get,
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
import { CommunicationsService } from './communications.service.js';
import { CreateBulletinDto } from './dto/create-bulletin.dto.js';
import { SendBroadcastDto } from './dto/send-broadcast.dto.js';

@ApiTags('Church Communications & Weekly Bulletin (Truyền Thông Mục Vụ & Bản Tin)')
@ApiBearerAuth()
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly commService: CommunicationsService) {}

  @Roles(Role.SeniorPastor, Role.Admin)
  @Post('broadcast')
  @ApiOperation({
    summary: 'Gửi tin nhắn SMS Twilio khẩn cấp hoặc Email mục vụ diện rộng (Pastor/Admin)',
  })
  @ApiResponse({ status: 201, description: 'Đã phát sóng thông điệp mục vụ thành công' })
  sendBroadcast(
    @CurrentUser('id') senderId: string,
    @Body() dto: SendBroadcastDto,
  ) {
    return this.commService.sendBroadcast(senderId, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Get('broadcasts')
  @ApiOperation({ summary: 'Xem lịch sử các thông điệp đã phát sóng (SMS & Email)' })
  @ApiResponse({ status: 200, description: 'Danh sách lịch sử thông điệp' })
  getBroadcastHistory(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.commService.getBroadcastHistory(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Public()
  @Get('bulletin/latest')
  @ApiOperation({ summary: 'Xem bản tin tuần mới nhất của Hội Thánh (Công khai)' })
  @ApiResponse({ status: 200, description: 'Chi tiết bản tin tuần' })
  getLatestBulletin() {
    return this.commService.getLatestBulletin();
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Get('bulletins')
  @ApiOperation({ summary: 'Xem danh sách toàn bộ các bản tin đã xuất bản' })
  getAllBulletins() {
    return this.commService.getAllBulletins();
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Post('bulletin')
  @ApiOperation({ summary: 'Đăng tải hoặc cập nhật bản tin Chúa Nhật tuần mới' })
  @ApiResponse({ status: 201, description: 'Đã lưu bản tin Hội Thánh' })
  createBulletin(@Body() dto: CreateBulletinDto) {
    return this.commService.createOrUpdateBulletin(dto);
  }
}
