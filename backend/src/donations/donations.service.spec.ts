import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DonationsService } from './donations.service.js';
import { Donation } from './entities/donation.entity.js';
import { FundType } from './enums/donation.enums.js';

describe('DonationsService', () => {
  let service: DonationsService;
  let donationRepo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    donationRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((d) => Promise.resolve({ id: 'donation-uuid-1', ...d })),
      findOne: vi.fn(),
      find: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    const configService = {
      get: vi.fn((key: string) => {
        if (key === 'STRIPE_SECRET_KEY') return 'mock_key';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        { provide: getRepositoryToken(Donation), useValue: donationRepo },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
  });

  describe('createPaymentIntent', () => {
    it('creates donation and returns simulation clientSecret', async () => {
      const result = await service.createPaymentIntent('user-1', {
        amount: 150,
        fundType: FundType.Tithes,
        donorName: 'David Tran',
        donorEmail: 'david@example.com',
      });

      expect(result.donationId).toBe('donation-uuid-1');
      expect(result.receiptNumber).toMatch(/^TAX-\d{4}-\d{6}$/);
      expect(donationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 150,
          currency: 'USD',
          fundType: FundType.Tithes,
          donorName: 'David Tran',
        }),
      );
    });
  });

  describe('getTaxReceipt', () => {
    it('throws NotFoundException when donation does not exist', async () => {
      donationRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getTaxReceipt('non-existent', 'user-1', false),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when requesting user is not owner and not admin', async () => {
      donationRepo.findOne.mockResolvedValue({
        id: 'd1',
        userId: 'other-user',
        donorEmail: 'other@example.com',
      });

      await expect(
        service.getTaxReceipt('d1', 'user-1', false),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns official IRS 501(c)(3) statement when user owns the donation', async () => {
      const mockDonation = {
        id: 'd1',
        userId: 'user-1',
        amount: 200,
        receiptNumber: 'TAX-2026-123456',
        taxDeductible: true,
      };
      donationRepo.findOne.mockResolvedValue(mockDonation);

      const result = await service.getTaxReceipt('d1', 'user-1', false);
      expect(result.taxExemptStatus).toContain('501(c)(3)');
      expect(result.receipt).toEqual(mockDonation);
    });
  });

  describe('getAdminSummary', () => {
    it('aggregates total donations and fund breakdown', async () => {
      donationRepo.find.mockResolvedValue([
        { amount: 500, fundType: FundType.Tithes, donorEmail: 'a@ex.com' },
        { amount: 200, fundType: FundType.Missions, donorEmail: 'b@ex.com' },
        { amount: 100, fundType: FundType.Tithes, donorEmail: 'a@ex.com' },
      ]);

      const result = await service.getAdminSummary(2026);
      expect(result.totalAmount).toBe(800);
      expect(result.fundBreakdown[FundType.Tithes]).toBe(600);
      expect(result.fundBreakdown[FundType.Missions]).toBe(200);
      expect(result.uniqueDonorsCount).toBe(2);
    });
  });

  describe('getAnnualTaxStatement & renderAnnualTaxStatementHtml', () => {
    it('aggregates annual giving records with IRS 501(c)(3) statement details', async () => {
      const mockQb = {
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([
          {
            amount: 500,
            fundType: FundType.Tithes,
            donorName: 'David Tran',
            donorAddress: '123 Main St, Dallas, TX',
            paymentMethodType: 'card',
            receiptNumber: 'TAX-2026-001',
            createdAt: new Date('2026-03-15'),
          },
          {
            amount: 250,
            fundType: FundType.Missions,
            donorName: 'David Tran',
            donorAddress: '123 Main St, Dallas, TX',
            paymentMethodType: 'ach_bank_transfer',
            receiptNumber: 'TAX-2026-002',
            createdAt: new Date('2026-06-20'),
          },
        ]),
      };
      donationRepo.createQueryBuilder.mockReturnValue(mockQb);

      const statement = await service.getAnnualTaxStatement('user-1', 'david@example.com', 2026);

      expect(statement.taxYear).toBe(2026);
      expect(statement.summary.totalContributions).toBe(750);
      expect(statement.summary.fundBreakdown[FundType.Tithes]).toBe(500);
      expect(statement.summary.fundBreakdown[FundType.Missions]).toBe(250);
      expect(statement.church.ein).toBe('75-3928174');
      expect(statement.legalDisclaimer).toContain('Internal Revenue Code Section 170(f)(8)');

      const html = service.renderAnnualTaxStatementHtml(statement);
      expect(html).toContain('Annual Contribution Statement — Tax Year 2026');
      expect(html).toContain('75-3928174');
      expect(html).toContain('$750.00');
      expect(html).toContain('David Tran');
    });
  });
});
