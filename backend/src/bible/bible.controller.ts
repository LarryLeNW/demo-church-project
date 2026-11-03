import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { BibleService } from './bible.service.js';
import { BiblePlanQueryDto } from './dto/bible-plan-query.dto.js';
import { CreateJournalDto } from './dto/create-journal.dto.js';
import { ToggleDayCompletionDto } from './dto/toggle-day-completion.dto.js';

@ApiTags('Bible Reading Plans & Devotional Journal (Đọc Kinh Thánh & Tĩnh Nguyện)')
@ApiBearerAuth()
@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'Xem danh sách các kế hoạch đọc Kinh Thánh' })
  @ApiResponse({ status: 200, description: 'Danh sách các kế hoạch đọc' })
  getPlans(@Query() query: BiblePlanQueryDto) {
    return this.bibleService.getPlans(query);
  }

  @Public()
  @Get('plans/:slug')
  @ApiOperation({ summary: 'Xem chi tiết kế hoạch đọc Kinh Thánh và các ngày đọc' })
  @ApiResponse({ status: 200, description: 'Chi tiết kế hoạch đọc' })
  getPlanBySlug(@Param('slug') slug: string) {
    return this.bibleService.getPlanBySlug(slug);
  }

  @Post('plans/:id/subscribe')
  @ApiOperation({ summary: 'Đăng ký tham gia một kế hoạch đọc Kinh Thánh' })
  @ApiResponse({ status: 201, description: 'Đã đăng ký kế hoạch' })
  subscribePlan(
    @CurrentUser('id') userId: string,
    @Param('id') planId: string,
  ) {
    return this.bibleService.subscribePlan(userId, planId);
  }

  @Get('my-plans')
  @ApiOperation({ summary: 'Xem các kế hoạch đọc Kinh Thánh cá nhân đang tham gia' })
  @ApiResponse({ status: 200, description: 'Danh sách kế hoạch cá nhân' })
  getMySubscriptions(@CurrentUser('id') userId: string) {
    return this.bibleService.getMySubscriptions(userId);
  }

  @Post('plans/:id/days/:day/toggle-complete')
  @ApiOperation({ summary: 'Đánh dấu hoàn thành hoặc chưa hoàn thành ngày đọc' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật tiến độ ngày đọc' })
  toggleDayCompletion(
    @CurrentUser('id') userId: string,
    @Param('id') planId: string,
    @Param('day', ParseIntPipe) dayNumber: number,
    @Body() dto: ToggleDayCompletionDto,
  ) {
    return this.bibleService.toggleDayCompletion(
      userId,
      planId,
      dayNumber,
      dto.isCompleted,
    );
  }

  @Get('journal')
  @ApiOperation({ summary: 'Xem danh sách nhật ký tĩnh nguyện cá nhân (SOAP Method)' })
  @ApiResponse({ status: 200, description: 'Danh sách nhật ký tĩnh nguyện' })
  getMyJournals(@CurrentUser('id') userId: string) {
    return this.bibleService.getMyJournals(userId);
  }

  @Get('journal/:id')
  @ApiOperation({ summary: 'Xem chi tiết một bài nhật ký tĩnh nguyện' })
  @ApiResponse({ status: 200, description: 'Chi tiết nhật ký' })
  getJournalById(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.bibleService.getJournalById(userId, id);
  }

  @Post('journal')
  @ApiOperation({ summary: 'Tạo bài nhật ký tĩnh nguyện mới (SOAP Method)' })
  @ApiResponse({ status: 201, description: 'Nhật ký tĩnh nguyện đã lưu' })
  createJournal(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateJournalDto,
  ) {
    return this.bibleService.createJournal(userId, dto);
  }

  @Delete('journal/:id')
  @ApiOperation({ summary: 'Xóa bài nhật ký tĩnh nguyện' })
  @ApiResponse({ status: 200, description: 'Đã xóa bài nhật ký' })
  deleteJournal(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.bibleService.deleteJournal(userId, id);
  }

  @Get('streaks/my-streak')
  @ApiOperation({ summary: 'Xem chuỗi ngày tĩnh nguyện liên tục và các cột mốc thuộc linh đã mở khóa' })
  @ApiResponse({ status: 200, description: 'Thông tin chuỗi ngày tĩnh nguyện và cột mốc' })
  getMyStreak(@CurrentUser('id') userId: string) {
    return this.bibleService.getMyStreak(userId);
  }

  @Post('streaks/record')
  @ApiOperation({ summary: 'Ghi nhận ngày tĩnh nguyện hoàn thành hôm nay' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật chuỗi ngày tĩnh nguyện' })
  recordStreak(@CurrentUser('id') userId: string) {
    return this.bibleService.recordDevotionalActivity(userId);
  }
}

