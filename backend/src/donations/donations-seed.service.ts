import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from './entities/donation.entity.js';
import {
  DonationFrequency,
  DonationStatus,
  FundType,
  PaymentMethodType,
} from './enums/donation.enums.js';

@Injectable()
export class DonationsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DonationsSeedService.name);

  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.donationRepo.count();
      if (count > 0) {
        return;
      }

      this.logger.log('Khởi tạo dữ liệu mẫu cho Sổ Quỹ Dâng Hiến & Chứng Từ Thuế 501(c)(3)...');

      await this.donationRepo.save([
        this.donationRepo.create({
          amount: 500,
          currency: 'USD',
          fundType: FundType.Tithes,
          frequency: DonationFrequency.Monthly,
          status: DonationStatus.Succeeded,
          paymentMethodType: PaymentMethodType.Card,
          stripePaymentIntentId: 'pi_seed_001',
          donorName: 'Gia đình Chấp sự David Nguyen',
          donorEmail: 'davidnguyen@example.com',
          donorAddress: '1504 Willowbrook Dr, Plano, TX 75093',
          receiptNumber: 'TAX-2026-100234',
          taxDeductible: true,
          notes: 'Dâng phần mười tháng 10/2026',
        }),
        this.donationRepo.create({
          amount: 250,
          currency: 'USD',
          fundType: FundType.Missions,
          frequency: DonationFrequency.OneTime,
          status: DonationStatus.Succeeded,
          paymentMethodType: PaymentMethodType.Card,
          stripePaymentIntentId: 'pi_seed_002',
          donorName: 'Bà Sarah Tran',
          donorEmail: 'sarahtran@example.com',
          donorAddress: '3201 Alma Dr, Richardson, TX 75080',
          receiptNumber: 'TAX-2026-100235',
          taxDeductible: true,
          notes: 'Dâng ủng hộ chuyến truyền giáo vùng cao',
        }),
        this.donationRepo.create({
          amount: 1000,
          currency: 'USD',
          fundType: FundType.Building,
          frequency: DonationFrequency.OneTime,
          status: DonationStatus.Succeeded,
          paymentMethodType: PaymentMethodType.Check,
          donorName: 'Gia đình Bác Thomas Le',
          donorEmail: 'thomasle@example.com',
          donorAddress: '4812 Legacy Dr, Frisco, TX 75034',
          receiptNumber: 'TAX-2026-100236',
          taxDeductible: true,
          notes: 'Séc số #2041 dâng xây dựng nhà Cơ Đốc Giáo Dục',
        }),
      ]);

      this.logger.log('Đã tạo thành công 3 giao dịch dâng hiến mẫu với mã biên nhận thuế IRS.');
    } catch (error) {
      this.logger.warn(`Lỗi khởi tạo seed dâng hiến: ${(error as Error).message}`);
    }
  }
}
