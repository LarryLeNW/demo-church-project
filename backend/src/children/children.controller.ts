import {
  Body,
  Controller,
  Get,
  Param,
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
import { ChildrenService } from './children.service.js';
import { CheckinChildrenDto } from './dto/checkin-children.dto.js';
import { CheckoutChildDto } from './dto/checkout-child.dto.js';
import { RegisterChildDto } from './dto/register-child.dto.js';
import { Classroom } from './enums/children.enums.js';

@ApiTags('Child Safety Check-in (Điểm Danh An Toàn Lớp Thiếu Nhi Chuẩn Hoa Kỳ)')
@ApiBearerAuth()
@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @ApiOperation({ summary: 'Phụ huynh hoặc Ban Thiếu nhi đăng ký hồ sơ bé mới' })
  @ApiResponse({ status: 201, description: 'Đã tạo hồ sơ bé' })
  registerChild(
    @CurrentUser('id') parentId: string,
    @Body() dto: RegisterChildDto,
  ) {
    return this.childrenService.registerChild(parentId, dto);
  }

  @Get('my-children')
  @ApiOperation({ summary: 'Xem danh sách các con của phụ huynh' })
  @ApiResponse({ status: 200, description: 'Danh sách hồ sơ các bé' })
  getMyChildren(@CurrentUser('id') parentId: string) {
    return this.childrenService.getMyChildren(parentId);
  }

  @Post('checkin')
  @ApiOperation({
    summary: 'Điểm danh Check-in an toàn cho bé vào lớp Chúa Nhật & sinh mã bảo mật',
  })
  @ApiResponse({ status: 201, description: 'Check-in thành công kèm mã an toàn và dữ liệu tem' })
  checkinChildren(
    @CurrentUser('id') userId: string,
    @Body() dto: CheckinChildrenDto,
  ) {
    return this.childrenService.checkinChildren(userId, userId, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Get('active-roster')
  @ApiOperation({
    summary: 'Xem danh sách các bé hiện đang có mặt trong các phòng học (Dành cho Giáo viên & Mục sư)',
  })
  @ApiResponse({ status: 200, description: 'Danh sách sĩ số và cảnh báo y tế từng phòng' })
  getActiveRoster(@Query('classroom') classroom?: Classroom) {
    return this.childrenService.getActiveRoster(classroom);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Post('checkout/:checkinId')
  @ApiOperation({
    summary: 'Giáo viên quét mã đối chiếu mã phụ huynh để bàn giao bé ra về an toàn',
  })
  @ApiResponse({ status: 200, description: 'Bàn giao bé an toàn thành công' })
  checkoutChild(
    @Param('checkinId') checkinId: string,
    @Body() dto: CheckoutChildDto,
    @CurrentUser('id') teacherUserId: string,
  ) {
    return this.childrenService.checkoutChild(checkinId, dto.securityCode, teacherUserId);
  }
}
