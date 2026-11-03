export enum HealthTier {
  EXCELLENT = 'excellent',
  HEALTHY = 'healthy',
  ATTENTION = 'attention',
  CRITICAL = 'critical',
}

export interface PillarDetail {
  key: string;
  labelVi: string;
  labelEn: string;
  score: number; // 0 - 100
  weight: number; // Percentage
  benchmark: string;
  status: 'strong' | 'good' | 'warning' | 'critical';
  insight: string;
}

export interface AtRiskMemberAlert {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  campusId: string;
  riskScore: number; // 0 - 100
  reasons: string[];
  suggestedAction: string;
  lastActiveDate: string | null;
}

export interface PathwayFunnelStep {
  stage: string;
  titleVi: string;
  titleEn: string;
  count: number;
  percentage: number;
}

export interface FundAllocationDetail {
  fundType: string;
  labelVi: string;
  total: number;
  percentage: number;
  transactionsCount: number;
}

export interface GivingStewardshipSummary {
  totalAmountYtd: number;
  totalDonors: number;
  averageDonation: number;
  recurringDonorsCount: number;
  funds: FundAllocationDetail[];
}

export interface CampusHealthComparison {
  campusId: string;
  campusName: string;
  memberCount: number;
  healthScore: number;
  totalGiving: number;
  attendanceRate: number;
}

export interface ExecutiveOverview {
  overallHealthScore: number;
  healthTier: HealthTier;
  healthTierLabelVi: string;
  healthTierLabelEn: string;
  biblicalVerdict: string;
  totalMembers: number;
  activeDisciples: number;
  atRiskCount: number;
  totalHouseholds: number;
  totalSmallGroups: number;
  pillars: {
    worship: PillarDetail;
    fellowship: PillarDetail;
    devotion: PillarDetail;
    stewardship: PillarDetail;
    service: PillarDetail;
  };
  funnel: PathwayFunnelStep[];
  atRiskMembers: AtRiskMemberAlert[];
  givingSummary: GivingStewardshipSummary;
  campuses: CampusHealthComparison[];
}

export interface AnnualExecutiveReport {
  year: number;
  churchName: string;
  generatedAt: string;
  executiveSummary: ExecutiveOverview;
  discipleshipProgress: {
    salvationsCount: number;
    baptismsCount: number;
    graduatedDisciplesCount: number;
    ordainedLeadersCount: number;
  };
  missionsAndOutreach: {
    missionsGivingTotal: number;
    missionsPercentage: number;
    outreachEventsCount: number;
    pastoralVisitsCompleted: number;
  };
}
