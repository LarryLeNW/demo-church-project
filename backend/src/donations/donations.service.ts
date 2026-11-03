import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Between, Repository } from 'typeorm';
import { EnvironmentVariables } from '../config/env.validation.js';
import { CreatePaymentIntentDto } from './dto/create-intent.dto.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { DonationQueryDto } from './dto/donation-query.dto.js';
import { RecordManualDonationDto } from './dto/record-manual-donation.dto.js';
import { Donation } from './entities/donation.entity.js';
import {
  DonationFrequency,
  DonationStatus,
  FundType,
  PaymentMethodType,
} from './enums/donation.enums.js';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);
  private stripe: Stripe | null = null;
  private readonly webhookSecret: string | null = null;

  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {
    const stripeKey = this.config.get<string>('STRIPE_SECRET_KEY');
    this.webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') || null;

    if (stripeKey && !stripeKey.startsWith('mock_')) {
      this.stripe = new Stripe(stripeKey);
      this.logger.log('Đã kích hoạt Stripe Payment Gateway trực tiếp.');
    } else {
      this.logger.log('Stripe đang hoạt động ở chế độ mô phỏng kiểm thử (Simulation Mode).');
    }
  }

  private generateReceiptNumber(year = new Date().getFullYear()): string {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `TAX-${year}-${randomSuffix}`;
  }

  async createPaymentIntent(userId: string | null, dto: CreatePaymentIntentDto) {
    const receiptNumber = this.generateReceiptNumber();

    const donation = this.donationRepo.create({
      userId: userId || null,
      amount: dto.amount,
      currency: 'USD',
      fundType: dto.fundType,
      frequency: DonationFrequency.OneTime,
      status: DonationStatus.Pending,
      paymentMethodType: dto.paymentMethodType || PaymentMethodType.Card,
      donorName: dto.donorName.trim(),
      donorEmail: dto.donorEmail.trim().toLowerCase(),
      donorAddress: dto.donorAddress?.trim() || null,
      notes: dto.notes?.trim() || null,
      receiptNumber,
      taxDeductible: true,
    });

    const savedDonation = await this.donationRepo.save(donation);

    if (this.stripe) {
      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(dto.amount * 100),
          currency: 'usd',
          receipt_email: dto.donorEmail,
          metadata: {
            donationId: savedDonation.id,
            fundType: dto.fundType,
            userId: userId || 'anonymous',
            receiptNumber,
          },
        });

        savedDonation.stripePaymentIntentId = paymentIntent.id;
        await this.donationRepo.save(savedDonation);

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          donationId: savedDonation.id,
          receiptNumber,
          donation: savedDonation,
        };
      } catch (error) {
        this.logger.error(`Lỗi tạo Stripe Payment Intent: ${(error as Error).message}`);
        throw new BadRequestException('Không thể kết nối cổng thanh toán Stripe.');
      }
    } else {
      // Simulation mode
      const mockIntentId = `pi_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      savedDonation.stripePaymentIntentId = mockIntentId;
      savedDonation.status = DonationStatus.Succeeded;
      await this.donationRepo.save(savedDonation);

      return {
        clientSecret: `${mockIntentId}_secret_test`,
        paymentIntentId: mockIntentId,
        donationId: savedDonation.id,
        receiptNumber,
        donation: savedDonation,
      };
    }
  }

  async createSubscription(userId: string | null, dto: CreateSubscriptionDto) {
    const receiptNumber = this.generateReceiptNumber();

    const donation = this.donationRepo.create({
      userId: userId || null,
      amount: dto.amount,
      currency: 'USD',
      fundType: dto.fundType,
      frequency: dto.frequency,
      status: DonationStatus.Pending,
      paymentMethodType: PaymentMethodType.Card,
      donorName: dto.donorName.trim(),
      donorEmail: dto.donorEmail.trim().toLowerCase(),
      donorAddress: dto.donorAddress?.trim() || null,
      receiptNumber,
      taxDeductible: true,
    });

    const savedDonation = await this.donationRepo.save(donation);

    if (this.stripe) {
      try {
        const customer = await this.stripe.customers.create({
          email: dto.donorEmail,
          name: dto.donorName,
          payment_method: dto.paymentMethodId,
          invoice_settings: { default_payment_method: dto.paymentMethodId },
        });

        // Create price dynamically or recurring price
        const price = await this.stripe.prices.create({
          unit_amount: Math.round(dto.amount * 100),
          currency: 'usd',
          recurring: {
            interval: dto.frequency === DonationFrequency.Weekly ? 'week' : 'month',
          },
          product_data: {
            name: `Dâng hiến định kỳ - ${dto.fundType.toUpperCase()}`,
          },
        });

        const subscription = await this.stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: price.id }],
          metadata: {
            donationId: savedDonation.id,
            fundType: dto.fundType,
            userId: userId || 'anonymous',
          },
        });

        savedDonation.stripeCustomerId = customer.id;
        savedDonation.stripeSubscriptionId = subscription.id;
        savedDonation.status = DonationStatus.Succeeded;
        await this.donationRepo.save(savedDonation);

        return {
          subscriptionId: subscription.id,
          donationId: savedDonation.id,
          receiptNumber,
          donation: savedDonation,
        };
      } catch (error) {
        this.logger.error(`Lỗi tạo Stripe Subscription: ${(error as Error).message}`);
        throw new BadRequestException('Không thể thiết lập dâng hiến định kỳ qua Stripe.');
      }
    } else {
      // Simulation mode
      const mockSubId = `sub_sim_${Date.now()}`;
      savedDonation.stripeSubscriptionId = mockSubId;
      savedDonation.status = DonationStatus.Succeeded;
      await this.donationRepo.save(savedDonation);

      return {
        subscriptionId: mockSubId,
        donationId: savedDonation.id,
        receiptNumber,
        donation: savedDonation,
      };
    }
  }

  async handleStripeWebhook(eventPayload: any, signature?: string) {
    let event = eventPayload;

    if (this.stripe && this.webhookSecret && signature) {
      try {
        event = this.stripe.webhooks.constructEvent(
          eventPayload,
          signature,
          this.webhookSecret,
        );
      } catch (err) {
        this.logger.warn(`Stripe webhook signature validation failed: ${(err as Error).message}`);
        throw new BadRequestException('Chữ ký Webhook không hợp lệ.');
      }
    }

    const eventType = event.type;
    const dataObject = event.data?.object;

    if (eventType === 'payment_intent.succeeded') {
      const intentId = dataObject.id;
      const donation = await this.donationRepo.findOne({
        where: { stripePaymentIntentId: intentId },
      });
      if (donation) {
        donation.status = DonationStatus.Succeeded;
        await this.donationRepo.save(donation);
        this.logger.log(`Khoản dâng hiến ${donation.receiptNumber} ($${donation.amount}) đã thành công.`);
      }
    } else if (eventType === 'payment_intent.payment_failed') {
      const intentId = dataObject.id;
      const donation = await this.donationRepo.findOne({
        where: { stripePaymentIntentId: intentId },
      });
      if (donation) {
        donation.status = DonationStatus.Failed;
        await this.donationRepo.save(donation);
        this.logger.warn(`Khoản dâng hiến ${donation.receiptNumber} đã thất bại.`);
      }
    }

    return { received: true };
  }

  async getMyHistory(userId: string, userEmail: string, query: DonationQueryDto) {
    const { page = 1, limit = 20, fundType, status, year } = query;
    const skip = (page - 1) * limit;

    const qb = this.donationRepo
      .createQueryBuilder('donation')
      .where('(donation.userId = :userId OR donation.donorEmail = :userEmail)', {
        userId,
        userEmail: userEmail.toLowerCase(),
      })
      .orderBy('donation.createdAt', 'DESC');

    if (fundType) {
      qb.andWhere('donation.fundType = :fundType', { fundType });
    }

    if (status) {
      qb.andWhere('donation.status = :status', { status });
    }

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      qb.andWhere('donation.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    // Calculate total successful giving amount
    const totalSucceededSum = await this.donationRepo
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'sum')
      .where('(donation.userId = :userId OR donation.donorEmail = :userEmail)', {
        userId,
        userEmail: userEmail.toLowerCase(),
      })
      .andWhere('donation.status = :succeeded', {
        succeeded: DonationStatus.Succeeded,
      })
      .getRawOne();

    const totalGiven = parseFloat(totalSucceededSum?.sum || '0');

    return {
      items,
      total,
      totalGiven,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminSummary(year = new Date().getFullYear()) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const donations = await this.donationRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
        status: DonationStatus.Succeeded,
      },
      order: { createdAt: 'DESC' },
    });

    let totalAmount = 0;
    const fundBreakdown: Record<string, number> = {
      [FundType.Tithes]: 0,
      [FundType.Missions]: 0,
      [FundType.Building]: 0,
      [FundType.Benevolence]: 0,
      [FundType.General]: 0,
    };

    const uniqueDonors = new Set<string>();

    for (const d of donations) {
      const amt = Number(d.amount) || 0;
      totalAmount += amt;
      fundBreakdown[d.fundType] = (fundBreakdown[d.fundType] || 0) + amt;
      if (d.donorEmail) {
        uniqueDonors.add(d.donorEmail);
      }
    }

    return {
      year,
      totalAmount,
      uniqueDonorsCount: uniqueDonors.size,
      totalDonationsCount: donations.length,
      fundBreakdown,
      recentDonations: donations.slice(0, 15),
    };
  }

  async recordManualDonation(recordedByUserId: string, dto: RecordManualDonationDto) {
    const receiptNumber = this.generateReceiptNumber();

    const donation = this.donationRepo.create({
      userId: null,
      amount: dto.amount,
      currency: 'USD',
      fundType: dto.fundType,
      frequency: DonationFrequency.OneTime,
      status: DonationStatus.Succeeded,
      paymentMethodType: dto.paymentMethodType,
      donorName: dto.donorName.trim(),
      donorEmail: dto.donorEmail ? dto.donorEmail.trim().toLowerCase() : 'cash-giver@church.local',
      notes: dto.notes ? `${dto.notes} (Được ghi nhận bởi nhân sự ${recordedByUserId})` : null,
      receiptNumber,
      taxDeductible: true,
    });

    return this.donationRepo.save(donation);
  }

  async getTaxReceipt(donationId: string, requestingUserId: string, isAdmin: boolean) {
    const donation = await this.donationRepo.findOne({
      where: { id: donationId },
      relations: { user: true },
    });

    if (!donation) {
      throw new NotFoundException('Không tìm thấy biên nhận dâng hiến.');
    }

    if (!isAdmin && donation.userId !== requestingUserId) {
      throw new ForbiddenException('Bạn không có quyền xem chứng từ thuế này.');
    }

    return {
      churchName: 'Grace Church US (Hội Thánh Ân Điển Hoa Kỳ)',
      churchEin: '75-3928174', // IRS 501(c)(3) EIN
      churchAddress: '1200 E Spring Creek Pkwy, Plano, TX 75074',
      taxExemptStatus: 'IRS 501(c)(3) Recognized Religious Organization',
      statementClause:
        'No goods or services were provided in exchange for this contribution, other than intangible religious benefits. All contributions are tax-deductible to the extent permitted by law.',
      receipt: donation,
    };
  }

  async getAnnualTaxStatement(userId: string | null, userEmail: string, year = new Date().getFullYear()) {
    const startDate = new Date(year, 0, 1, 0, 0, 0);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const qb = this.donationRepo
      .createQueryBuilder('donation')
      .where('donation.status = :succeeded', { succeeded: DonationStatus.Succeeded })
      .andWhere('donation.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('donation.createdAt', 'ASC');

    if (userId) {
      qb.andWhere('(donation.userId = :userId OR donation.donorEmail = :userEmail)', {
        userId,
        userEmail: userEmail.toLowerCase(),
      });
    } else {
      qb.andWhere('donation.donorEmail = :userEmail', {
        userEmail: userEmail.toLowerCase(),
      });
    }

    const donations = await qb.getMany();

    let totalContributions = 0;
    const fundBreakdown: Record<string, number> = {
      [FundType.Tithes]: 0,
      [FundType.Missions]: 0,
      [FundType.Building]: 0,
      [FundType.Benevolence]: 0,
      [FundType.General]: 0,
    };

    let donorName = userEmail;
    let donorAddress: string | null = null;

    for (const d of donations) {
      const amt = Number(d.amount) || 0;
      totalContributions += amt;
      fundBreakdown[d.fundType] = (fundBreakdown[d.fundType] || 0) + amt;
      if (d.donorName) donorName = d.donorName;
      if (d.donorAddress) donorAddress = d.donorAddress;
    }

    const statementNumber = `STMT-${year}-${userEmail.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      taxYear: year,
      generatedDate: new Date().toISOString(),
      statementNumber,
      church: {
        name: 'Grace Church US',
        vietnameseName: 'Hội Thánh Tin Lành Ân Điển Hoa Kỳ',
        ein: '75-3928174',
        status: 'IRS 501(c)(3) Tax-Exempt Religious Organization',
        address: '1200 E Spring Creek Pkwy, Plano, TX 75074',
        phone: '(972) 555-0199',
        email: 'giving@gracechurch.us',
        website: 'https://gracechurch.us',
      },
      donor: {
        fullName: donorName,
        email: userEmail,
        address: donorAddress || 'Address on file with Church Administration',
      },
      summary: {
        totalContributions,
        currency: 'USD',
        fundBreakdown,
        contributionsCount: donations.length,
      },
      contributions: donations.map((d) => ({
        date: d.createdAt.toISOString().slice(0, 10),
        receiptNumber: d.receiptNumber,
        fundType: d.fundType,
        paymentMethodType: d.paymentMethodType,
        amount: Number(d.amount),
        notes: d.notes,
      })),
      legalDisclaimer:
        'In accordance with Internal Revenue Code Section 170(f)(8), no goods or services were provided in whole or partial exchange for these contributions, other than intangible religious benefits. All contributions listed on this statement are tax-deductible to the fullest extent permitted by law for federal and state income tax purposes (IRS Form 1040, Schedule A).',
      signatories: {
        seniorPastor: {
          name: 'Rev. Barnabas Nguyen',
          title: 'Senior Pastor / Mục Sư Quản Nhiệm',
        },
        treasurer: {
          name: 'Sarah Tran, CPA',
          title: 'Church Treasurer / Trưởng Ban Tài Chánh',
        },
      },
    };
  }

  renderAnnualTaxStatementHtml(statement: Awaited<ReturnType<typeof this.getAnnualTaxStatement>>): string {
    const fundLabels: Record<string, string> = {
      tithes: 'Thập phân (Tithes)',
      missions: 'Truyền giáo & Mở hội thánh (Missions)',
      building: 'Xây dựng Cơ sở Nhà Chúa (Building Fund)',
      benevolence: 'Bác ái & Giúp đỡ (Benevolence)',
      general: 'Quỹ hoạt động chung (General Ministry)',
    };

    const methodLabels: Record<string, string> = {
      card: 'Thẻ tín dụng / Stripe Card',
      ach_bank_transfer: 'Chuyển khoản trực tiếp ACH (US Bank)',
      check: 'Séc (Check)',
      cash: 'Tiền mặt (Cash)',
    };

    const itemRows = statement.contributions
      .map(
        (c) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${c.date}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-family: monospace; color: #475569;">${c.receiptNumber || '—'}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${fundLabels[c.fundType] || c.fundType}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">${methodLabels[c.paymentMethodType] || c.paymentMethodType}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; text-align: right; color: #1e293b;">$${c.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>`,
      )
      .join('');

    const breakdownRows = Object.entries(statement.summary.fundBreakdown)
      .filter(([, amount]) => amount > 0)
      .map(
        ([fund, amount]) => `
        <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; border-bottom: 1px dashed #cbd5e1;">
          <span style="color: #475569;">${fundLabels[fund] || fund}</span>
          <span style="font-weight: 600; color: #0f172a;">$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>`,
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IRS 501(c)(3) Annual Giving Statement - ${statement.taxYear} - ${statement.donor.fullName}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif, 'Be Vietnam Pro', sans-serif;
      color: #1e293b;
      background: #fbf9f5;
      margin: 0;
      padding: 30px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border: 2px solid #b45309;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #312e81;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .church-info h1 {
      margin: 0;
      font-size: 24px;
      color: #312e81;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .church-info h2 {
      margin: 4px 0 0 0;
      font-size: 15px;
      color: #b45309;
      font-style: italic;
    }
    .church-meta {
      font-size: 12px;
      color: #475569;
      margin-top: 6px;
      line-height: 1.4;
    }
    .badge-501c3 {
      border: 1.5px solid #15803d;
      background: #f0fdf4;
      color: #15803d;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      text-align: right;
      letter-spacing: 0.5px;
    }
    .statement-title-box {
      text-align: center;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      padding: 12px;
      margin-bottom: 25px;
    }
    .statement-title-box h3 {
      margin: 0;
      font-size: 18px;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .statement-title-box p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #64748b;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }
    .info-card {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      padding: 14px;
      border-radius: 4px;
    }
    .info-card h4 {
      margin: 0 0 8px 0;
      font-size: 12px;
      text-transform: uppercase;
      color: #78716c;
      letter-spacing: 0.5px;
    }
    .info-card p {
      margin: 2px 0;
      font-size: 13px;
    }
    .summary-box {
      background: #fdfbf7;
      border: 1px solid #fde68a;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 25px;
    }
    .total-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #b45309;
    }
    .total-banner span.label {
      font-size: 15px;
      font-weight: bold;
      color: #1e293b;
    }
    .total-banner span.amount {
      font-size: 22px;
      font-weight: bold;
      color: #b45309;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      text-align: left;
      padding: 8px 12px;
      font-size: 12px;
      text-transform: uppercase;
      border-bottom: 2px solid #cbd5e1;
    }
    .disclaimer {
      background: #f8fafc;
      border-left: 4px solid #312e81;
      padding: 12px 16px;
      font-size: 11px;
      color: #475569;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
      padding-top: 20px;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      padding-top: 8px;
      text-align: center;
    }
    .sig-name {
      font-size: 13px;
      font-weight: bold;
      color: #0f172a;
    }
    .sig-title {
      font-size: 11px;
      color: #64748b;
    }
    .actions-bar {
      margin-top: 25px;
      text-align: center;
    }
    .print-btn {
      background: #312e81;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(49, 46, 129, 0.3);
    }
    .print-btn:hover {
      background: #1e1b4b;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
        width: 100%;
        max-width: 100%;
      }
      .actions-bar {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="church-info">
        <h1>${statement.church.name}</h1>
        <h2>${statement.church.vietnameseName}</h2>
        <div class="church-meta">
          <div>${statement.church.address}</div>
          <div>Tel: ${statement.church.phone} | Email: ${statement.church.email}</div>
          <div>Website: ${statement.church.website}</div>
        </div>
      </div>
      <div>
        <div class="badge-501c3">
          ${statement.church.status}<br>
          IRS EIN: <strong>${statement.church.ein}</strong>
        </div>
        <div style="font-size: 11px; text-align: right; color: #64748b; margin-top: 6px;">
          Statement #: ${statement.statementNumber}<br>
          Issued: ${new Date(statement.generatedDate).toLocaleDateString('en-US')}
        </div>
      </div>
    </div>

    <div class="statement-title-box">
      <h3>Annual Contribution Statement — Tax Year ${statement.taxYear}</h3>
      <p>Chứng Từ Dâng Hiến Khấu Trừ Thuế Thường Niên (IRS Form 1040 Schedule A)</p>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h4>Donor Information (Thông Tin Tín Hữu)</h4>
        <p><strong>${statement.donor.fullName}</strong></p>
        <p>${statement.donor.email}</p>
        <p style="color: #64748b;">${statement.donor.address}</p>
      </div>
      <div class="info-card">
        <h4>Period & Verification (Thời Kỳ Khai Thuế)</h4>
        <p>Period: <strong>Jan 1, ${statement.taxYear} — Dec 31, ${statement.taxYear}</strong></p>
        <p>Total Transactions: <strong>${statement.summary.contributionsCount}</strong></p>
        <p>Filing Classification: <strong>Charitable Contribution</strong></p>
      </div>
    </div>

    <div class="summary-box">
      <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #78716c;">Summary of Contributions by Fund (Tổng Hợp Theo Quỹ)</h4>
      ${breakdownRows}
      <div class="total-banner">
        <span class="label">Total Tax-Deductible Contribution (Tổng Dâng Hiến Khấu Trừ Thuế):</span>
        <span class="amount">$${statement.summary.totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>

    <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #475569;">Itemized Contribution Records (Chi Tiết Các Lần Dâng Hiến)</h4>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Receipt #</th>
          <th>Fund Purpose</th>
          <th>Method</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8;">Không có giao dịch dâng hiến nào trong năm tính thuế này.</td></tr>'}
      </tbody>
    </table>

    <div class="disclaimer">
      <strong>IRS Legal Written Acknowledgment Notice:</strong><br>
      ${statement.legalDisclaimer}
    </div>

    <div class="signatures">
      <div class="sig-line">
        <div class="sig-name">${statement.signatories.seniorPastor.name}</div>
        <div class="sig-title">${statement.signatories.seniorPastor.title}</div>
      </div>
      <div class="sig-line">
        <div class="sig-name">${statement.signatories.treasurer.name}</div>
        <div class="sig-title">${statement.signatories.treasurer.title}</div>
      </div>
    </div>

    <div class="actions-bar">
      <button onclick="window.print()" class="print-btn">🖨️ In / Tải PDF (Print or Save as PDF)</button>
    </div>
  </div>
</body>
</html>`;
  }
}

