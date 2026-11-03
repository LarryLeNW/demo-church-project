import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator.js';

@ApiTags('System & Health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Kiểm tra trạng thái hoạt động hệ thống (Health Check)' })
  @ApiResponse({
    status: 200,
    description: 'Hệ thống hoạt động bình thường',
    schema: {
      example: {
        status: 'ok',
        service: 'Teacher LMS API',
        timestamp: '2026-11-02T01:30:00.000Z',
        uptime: 120,
      },
    },
  })
  health() {
    return {
      status: 'ok',
      service: 'Church LMS API',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
    };
  }
}
