import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { DonationsService } from './donations.service.js';
import { CreatePaymentIntentDto } from './dto/create-intent.dto.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { DonationQueryDto } from './dto/donation-query.dto.js';
import { RecordManualDonationDto } from './dto/record-manual-donation.dto.js';

@ApiTags('Online Giving & IRS 501(c)(3) Tax Statements (Dâng Hiến & Thuế)')
@ApiBearerAuth()
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Public()
  @Post('create-intent')
  @ApiOperation({ summary: 'Khởi tạo thanh toán dâng hiến một lần (Stripe Payment Intent)' })
  @ApiResponse({ status: 201, description: 'Client secret để hiển thị Stripe Elements' })
  createIntent(
    @Body() dto: CreatePaymentIntentDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.donationsService.createPaymentIntent(userId || null, dto);
  }

  @Post('create-subscription')
  @ApiOperation({ summary: 'Thiết lập dâng hiến định kỳ hàng tuần / hàng tháng' })
  @ApiResponse({ status: 201, description: 'Thiết lập gói dâng hiến định kỳ thành công' })
  createSubscription(
    @Body() dto: CreateSubscriptionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.donationsService.createSubscription(userId, dto);
  }

  @Public()
  @Post('webhook/stripe')
  @ApiOperation({ summary: 'Webhook nhận thông báo trạng thái thanh toán từ Stripe' })
  handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature?: string,
  ) {
    return this.donationsService.handleStripeWebhook(req.body, signature);
  }

  @Get('my-history')
  @ApiOperation({ summary: 'Xem lịch sử dâng hiến và tổng số tiền dâng của cá nhân' })
  @ApiResponse({ status: 200, description: 'Danh sách các lần dâng hiến' })
  getMyHistory(
    @CurrentUser() user: User,
    @Query() query: DonationQueryDto,
  ) {
    return this.donationsService.getMyHistory(user.id, user.email, query);
  }

  @Get('annual-statement')
  @ApiOperation({ summary: 'Xem báo cáo dâng hiến thường niên chuẩn IRS 501(c)(3) dạng JSON' })
  @ApiResponse({ status: 200, description: 'Dữ liệu chứng từ dâng hiến cả năm' })
  getAnnualTaxStatement(
    @CurrentUser() user: User,
    @Query('year') year?: number,
  ) {
    const targetYear = year ? Number(year) : new Date().getFullYear();
    return this.donationsService.getAnnualTaxStatement(user.id, user.email, targetYear);
  }

  @Get('annual-statement/print')
  @ApiOperation({ summary: 'Xuất bản in / PDF chứng từ khấu trừ thuế thường niên IRS 501(c)(3)' })
  @ApiResponse({ status: 200, description: 'Giao diện in ấn HTML' })
  async printAnnualTaxStatement(
    @CurrentUser() user: User,
    @Query('year') year: number | undefined,
    @Res() res: Response,
  ) {
    const targetYear = year ? Number(year) : new Date().getFullYear();
    const statement = await this.donationsService.getAnnualTaxStatement(user.id, user.email, targetYear);
    const html = this.donationsService.renderAnnualTaxStatementHtml(statement);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  @Get('receipt/:id')
  @ApiOperation({ summary: 'Tải thông tin chứng từ khấu trừ thuế IRS 501(c)(3)' })
  @ApiResponse({ status: 200, description: 'Chi tiết biên nhận thuế' })
  getTaxReceipt(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const isAdmin =
      user.role === Role.SeniorPastor || user.role === Role.Admin;
    return this.donationsService.getTaxReceipt(id, user.id, isAdmin);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Get('admin/summary')
  @ApiOperation({ summary: 'Báo cáo tổng hợp tài chính dâng hiến (Chỉ Mục sư & Ban Trị Sự)' })
  @ApiResponse({ status: 200, description: 'Thống kê tổng dâng hiến theo từng quỹ' })
  getAdminSummary(@Query('year') year?: number) {
    return this.donationsService.getAdminSummary(year);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Get('admin/annual-statement')
  @ApiOperation({ summary: 'Tra cứu báo cáo thuế 501(c)(3) của bất kỳ tín hữu nào (Dành cho Quản Trị)' })
  @ApiResponse({ status: 200, description: 'Chứng từ thuế năm của tín hữu được chọn' })
  getAdminDonorStatement(
    @Query('email') email: string,
    @Query('year') year?: number,
  ) {
    const targetYear = year ? Number(year) : new Date().getFullYear();
    return this.donationsService.getAnnualTaxStatement(null, email, targetYear);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Get('admin/annual-statement/print')
  @ApiOperation({ summary: 'In chứng từ thuế 501(c)(3) cho tín hữu bất kỳ (Dành cho Quản Trị)' })
  @ApiResponse({ status: 200, description: 'Giao diện HTML in ấn chứng từ thuế' })
  async printAdminDonorStatement(
    @Query('email') email: string,
    @Query('year') year: number | undefined,
    @Res() res: Response,
  ) {
    const targetYear = year ? Number(year) : new Date().getFullYear();
    const statement = await this.donationsService.getAnnualTaxStatement(null, email, targetYear);
    const html = this.donationsService.renderAnnualTaxStatementHtml(statement);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  @Roles(Role.SeniorPastor, Role.Admin)
  @Post('admin/record-manual')
  @ApiOperation({ summary: 'Ghi nhận dâng hiến tiền mặt hoặc séc (Check) tại buổi nhóm Chúa Nhật' })
  @ApiResponse({ status: 201, description: 'Đã ghi sổ quỹ và cấp mã biên nhận thuế' })
  recordManual(
    @CurrentUser('id') adminId: string,
    @Body() dto: RecordManualDonationDto,
  ) {
    return this.donationsService.recordManualDonation(adminId, dto);
  }
}

