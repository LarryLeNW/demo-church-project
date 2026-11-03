import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { SermonsService } from './sermons.service.js';
import { CreateOutlineDto } from './dto/create-outline.dto.js';
import { SaveMyNoteDto } from './dto/save-my-note.dto.js';
import { OutlineQueryDto } from './dto/outline-query.dto.js';

@ApiTags('Interactive Sermon Notes (Ghi Chú Bài Giảng Tương Tác Chúa Nhật)')
@ApiBearerAuth()
@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonsService: SermonsService) {}

  @Public()
  @Get('outlines')
  @ApiOperation({ summary: 'Lấy danh sách các dàn ý bài giảng Chúa Nhật' })
  @ApiResponse({ status: 200, description: 'Danh sách dàn ý bài giảng' })
  findAllOutlines(@Query() query: OutlineQueryDto) {
    return this.sermonsService.findAllOutlines(query);
  }

  @Public()
  @Get('outlines/latest')
  @ApiOperation({ summary: 'Lấy bài giảng Chúa Nhật mới nhất để theo dõi tương tác' })
  @ApiResponse({ status: 200, description: 'Dàn ý bài giảng mới nhất' })
  findLatestOutline(@Query('campusId') campusId?: string) {
    return this.sermonsService.findLatestOutline(campusId);
  }

  @Public()
  @Get('outlines/:id')
  @ApiOperation({ summary: 'Lấy chi tiết một bài giảng theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết bài giảng' })
  findOutlineById(@Param('id') id: string) {
    return this.sermonsService.findOutlineById(id);
  }

  @Get('my-notes/:outlineId')
  @ApiOperation({ summary: 'Lấy ghi chú cá nhân và các từ điền khuyết của tôi cho bài giảng này' })
  @ApiResponse({ status: 200, description: 'Ghi chú cá nhân' })
  getMyNote(
    @Param('outlineId') outlineId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sermonsService.getMyNote(outlineId, userId);
  }

  @Put('my-notes/:outlineId')
  @ApiOperation({ summary: 'Lưu ghi chú, từ điền khuyết và lời cam kết của tôi' })
  @ApiResponse({ status: 200, description: 'Lưu thành công' })
  saveMyNote(
    @Param('outlineId') outlineId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SaveMyNoteDto,
  ) {
    return this.sermonsService.saveMyNote(outlineId, userId, dto);
  }

  @Post('my-notes/:outlineId/email')
  @ApiOperation({ summary: 'Gửi bản ghi chú bài giảng về email của tôi' })
  @ApiResponse({ status: 200, description: 'Gửi email thành công' })
  emailMyNotes(
    @Param('outlineId') outlineId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('email') userEmail: string,
  ) {
    return this.sermonsService.emailMyNotes(outlineId, userId, userEmail || 'member@church.local');
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Post('outlines')
  @ApiOperation({ summary: 'Soạn thảo & xuất bản dàn ý bài giảng Chúa Nhật mới' })
  @ApiResponse({ status: 201, description: 'Xuất bản thành công' })
  createOutline(@Body() dto: CreateOutlineDto) {
    return this.sermonsService.createOutline(dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Patch('outlines/:id')
  @ApiOperation({ summary: 'Cập nhật dàn ý bài giảng' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  updateOutline(@Param('id') id: string, @Body() dto: Partial<CreateOutlineDto>) {
    return this.sermonsService.updateOutline(id, dto);
  }

  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  @Delete('outlines/:id')
  @ApiOperation({ summary: 'Xóa dàn ý bài giảng' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  deleteOutline(@Param('id') id: string) {
    return this.sermonsService.deleteOutline(id);
  }
}
