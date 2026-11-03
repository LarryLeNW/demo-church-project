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
import { CoursesService } from './courses.service.js';
import { CourseQueryDto } from './dto/course-query.dto.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { SaveLessonProgressDto } from './dto/lesson-progress.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';

@ApiTags('Discipleship Courses & Sermon Vault (Khóa Học & Kho Bài Giảng)')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách khóa học và bài giảng (lọc chuyên mục, ngôn ngữ)' })
  @ApiResponse({ status: 200, description: 'Danh sách khóa học' })
  findAll(@Query() query: CourseQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Xem chi tiết khóa học và danh sách bài học theo slug' })
  @ApiResponse({ status: 200, description: 'Chi tiết khóa học' })
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Post()
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Tạo khóa học / chuỗi bài giảng mới' })
  @ApiResponse({ status: 201, description: 'Khóa học đã tạo' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Cập nhật thông tin khóa học' })
  @ApiResponse({ status: 200, description: 'Khóa học đã cập nhật' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.SeniorPastor)
  @ApiOperation({ summary: 'Xóa khóa học' })
  @ApiResponse({ status: 200, description: 'Đã xóa khóa học' })
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

  @Post(':id/lessons')
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Thêm bài học mới vào khóa học' })
  @ApiResponse({ status: 201, description: 'Bài học đã tạo' })
  addLesson(@Param('id') id: string, @Body() dto: CreateLessonDto) {
    return this.coursesService.addLesson(id, dto);
  }

  @Patch('lessons/:lessonId')
  @Roles(Role.Admin, Role.SeniorPastor, Role.MinistryLeader)
  @ApiOperation({ summary: 'Cập nhật thông tin bài học' })
  @ApiResponse({ status: 200, description: 'Bài học đã cập nhật' })
  updateLesson(@Param('lessonId') lessonId: string, @Body() dto: UpdateLessonDto) {
    return this.coursesService.updateLesson(lessonId, dto);
  }

  @Delete('lessons/:lessonId')
  @Roles(Role.Admin, Role.SeniorPastor)
  @ApiOperation({ summary: 'Xóa bài học' })
  @ApiResponse({ status: 200, description: 'Đã xóa bài học' })
  deleteLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.deleteLesson(lessonId);
  }

  @Get(':id/my-progress')
  @ApiOperation({ summary: 'Lấy tiến độ học tập của tín hữu cho khóa học này' })
  @ApiResponse({ status: 200, description: 'Tiến độ học tập và ghi chú' })
  getMyProgress(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.coursesService.getUserCourseProgress(userId, id);
  }

  @Post('lessons/:lessonId/progress')
  @ApiOperation({ summary: 'Lưu tiến độ hoàn thành và ghi chú bài giảng của tín hữu' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật tiến độ' })
  saveProgress(
    @Param('lessonId') lessonId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SaveLessonProgressDto,
  ) {
    return this.coursesService.saveLessonProgress(userId, lessonId, dto);
  }
}
