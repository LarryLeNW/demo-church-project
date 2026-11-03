import {
  Body,
  Controller,
  Delete,
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
import { Public } from '../common/decorators/public.decorator.js';
import { AddMemoryVerseDto } from './dto/add-memory-verse.dto.js';
import { ReviewVerseDto } from './dto/review-verse.dto.js';
import { ScriptureQueryDto } from './dto/scripture-query.dto.js';
import { ScriptureTopic } from './enums/scripture.enums.js';
import { ScriptureService } from './scripture.service.js';

@ApiTags('Scripture Memory SRS (Ghi Nhớ Lời Chúa Theo Thuật Toán Ngắt Quãng)')
@ApiBearerAuth()
@Controller('scripture')
export class ScriptureController {
  constructor(private readonly scriptureService: ScriptureService) {}

  @Public()
  @Get('library')
  @ApiOperation({ summary: 'Xem danh mục các câu gốc mẫu theo chủ đề của Hội Thánh' })
  @ApiResponse({ status: 200, description: 'Danh mục câu gốc mẫu' })
  getLibrary(@Query('topic') topic?: ScriptureTopic) {
    return this.scriptureService.getVerseLibrary(topic);
  }

  @Get('my-memories')
  @ApiOperation({ summary: 'Lấy danh sách các câu gốc đang học và đến hạn ôn tập của cá nhân' })
  @ApiResponse({ status: 200, description: 'Danh sách câu gốc cá nhân' })
  getMyMemories(
    @CurrentUser('id') userId: string,
    @Query() query: ScriptureQueryDto,
  ) {
    return this.scriptureService.getMyMemories(userId, query);
  }

  @Post('memories')
  @ApiOperation({ summary: 'Thêm một câu gốc mới vào lộ trình ghi nhớ của cá nhân' })
  @ApiResponse({ status: 201, description: 'Đã thêm câu gốc' })
  addVerse(
    @CurrentUser('id') userId: string,
    @Body() dto: AddMemoryVerseDto,
  ) {
    return this.scriptureService.addVerseToMemory(userId, dto);
  }

  @Post('memories/:id/review')
  @ApiOperation({ summary: 'Gửi kết quả ôn tập flashcard theo thuật toán SuperMemo SM-2' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật lịch ôn tập tiếp theo' })
  reviewVerse(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ReviewVerseDto,
  ) {
    return this.scriptureService.reviewVerse(userId, id, dto);
  }

  @Delete('memories/:id')
  @ApiOperation({ summary: 'Xóa câu gốc khỏi danh sách ôn tập cá nhân' })
  @ApiResponse({ status: 200, description: 'Đã xóa' })
  removeVerse(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.scriptureService.removeVerse(userId, id);
  }
}
