import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SpiritualStage } from '../pathway/enums/pathway.enums.js';
import { AttendanceStatus } from '../groups/enums/group.enums.js';
import { DonationStatus, FundType } from '../donations/enums/donation.enums.js';
import { RosterStatus } from '../volunteers/enums/volunteer.enums.js';
import { CareStatus } from '../pastoral/enums/pastoral.enums.js';
import { AnalyticsService } from './analytics.service.js';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let userRepo: any;
  let profileRepo: any;
  let groupRepo: any;
  let attendanceRepo: any;
  let donationRepo: any;
  let careRepo: any;
  let rosterRepo: any;
  let householdRepo: any;

  beforeEach(() => {
    userRepo = {
      createQueryBuilder: vi.fn(() => ({
        andWhere: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([
          { id: 'u1', fullName: 'User 1' },
          { id: 'u2', fullName: 'User 2' },
          { id: 'u3', fullName: 'User 3' },
        ]),
      })),
    };

    profileRepo = {
      find: vi.fn().mockResolvedValue([
        { userId: 'u1', currentStage: SpiritualStage.DISCIPLE },
        { userId: 'u2', currentStage: SpiritualStage.BAPTIZED },
        { userId: 'u3', currentStage: SpiritualStage.MINISTRY_LEADER },
      ]),
    };

    groupRepo = {
      count: vi.fn().mockResolvedValue(5),
    };

    attendanceRepo = {
      find: vi.fn().mockResolvedValue([
        { status: AttendanceStatus.Present },
        { status: AttendanceStatus.Present },
        { status: AttendanceStatus.Absent },
      ]),
    };

    donationRepo = {
      createQueryBuilder: vi.fn(() => ({
        where: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([
          { amount: 500, fundType: FundType.General, userId: 'u1' },
          { amount: 300, fundType: FundType.Missions, userId: 'u2' },
          { amount: 200, fundType: FundType.Building, userId: 'u1' },
        ]),
      })),
    };

    careRepo = {
      count: vi.fn().mockResolvedValue(10),
    };

    rosterRepo = {
      find: vi.fn().mockResolvedValue([
        { status: RosterStatus.CONFIRMED },
        { status: RosterStatus.CONFIRMED },
        { status: RosterStatus.DECLINED },
      ]),
    };

    householdRepo = {
      createQueryBuilder: vi.fn(() => ({
        andWhere: vi.fn().mockReturnThis(),
        getCount: vi.fn().mockResolvedValue(15),
      })),
    };

    service = new AnalyticsService(
      userRepo,
      profileRepo,
      groupRepo,
      attendanceRepo,
      donationRepo,
      careRepo,
      rosterRepo,
      householdRepo,
    );
  });

  it('calculates executive overview with 5 pillars of spiritual health', async () => {
    const overview = await service.getExecutiveOverview();

    expect(overview).toBeDefined();
    expect(overview.totalMembers).toBe(3);
    expect(overview.totalSmallGroups).toBe(5);
    expect(overview.totalHouseholds).toBe(15);
    expect(overview.overallHealthScore).toBeGreaterThanOrEqual(0);
    expect(overview.overallHealthScore).toBeLessThanOrEqual(100);

    // Verify 5 pillars exist
    expect(overview.pillars.worship).toBeDefined();
    expect(overview.pillars.fellowship).toBeDefined();
    expect(overview.pillars.devotion).toBeDefined();
    expect(overview.pillars.stewardship).toBeDefined();
    expect(overview.pillars.service).toBeDefined();
  });

  it('evaluates spiritual pathway funnel with conversion counts', async () => {
    const overview = await service.getExecutiveOverview();

    expect(overview.funnel).toHaveLength(6);
    const discipleStep = overview.funnel.find(
      (f) => f.stage === SpiritualStage.DISCIPLE,
    );
    expect(discipleStep).toBeDefined();
    expect(discipleStep?.count).toBe(1);
  });

  it('aggregates giving stewardship summary with fund allocation breakdowns', async () => {
    const overview = await service.getExecutiveOverview();

    expect(overview.givingSummary.totalAmountYtd).toBe(1000);
    expect(overview.givingSummary.totalDonors).toBe(2);
    expect(overview.givingSummary.funds.length).toBeGreaterThan(0);

    const missions = overview.givingSummary.funds.find(
      (f) => f.fundType === FundType.Missions,
    );
    expect(missions).toBeDefined();
    expect(missions?.total).toBe(300);
  });

  it('identifies predictive at-risk members needing pastoral visitation', async () => {
    const overview = await service.getExecutiveOverview();

    expect(overview.atRiskMembers.length).toBeGreaterThan(0);
    const firstRisk = overview.atRiskMembers[0];
    expect(firstRisk.fullName).toBeDefined();
    expect(firstRisk.reasons.length).toBeGreaterThan(0);
    expect(firstRisk.suggestedAction).toContain('Mục sư');
  });

  it('generates multi-campus health comparisons', async () => {
    const overview = await service.getExecutiveOverview();

    expect(overview.campuses).toHaveLength(4);
    const dallas = overview.campuses.find((c) => c.campusId === 'Dallas Main Campus');
    expect(dallas).toBeDefined();
    expect(dallas?.healthScore).toBeGreaterThan(0);
  });

  it('generates annual executive report for church business meeting', async () => {
    const report = await service.getAnnualExecutiveReport(undefined, 2026);

    expect(report.year).toBe(2026);
    expect(report.churchName).toContain('Hội Thánh Ân Điển');
    expect(report.discipleshipProgress.salvationsCount).toBe(18);
    expect(report.discipleshipProgress.baptismsCount).toBe(12);
    expect(report.missionsAndOutreach.pastoralVisitsCompleted).toBe(10);
  });
});
