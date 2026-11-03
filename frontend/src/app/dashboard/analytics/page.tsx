"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  LineChart,
  Sparkles,
  ShieldAlert,
  Users,
  Compass,
  Heart,
  DollarSign,
  HeartPulse,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  FileDown,
  Printer,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
} from "lucide-react";

export interface PillarDetail {
  key: string;
  labelVi: string;
  labelEn: string;
  score: number;
  weight: number;
  benchmark: string;
  status: "strong" | "good" | "warning" | "critical";
  insight: string;
}

export interface AtRiskMemberAlert {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  campusId: string;
  riskScore: number;
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
  healthTier: "excellent" | "healthy" | "attention" | "critical";
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

const CAMPUSES = [
  { id: "all", name: "Toàn bộ Hội Thánh (All Campuses)" },
  { id: "Dallas Main Campus", name: "Dallas Main Campus" },
  { id: "Houston Campus", name: "Houston Campus" },
  { id: "Fort Worth Campus", name: "Fort Worth Campus" },
  { id: "Austin Campus", name: "Austin Campus" },
];

export default function AnalyticsExecutivePage() {
  const { user } = useAuth();
  const { bilingual, pick, isEn } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExecutiveOverview | null>(null);
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [annualReport, setAnnualReport] = useState<AnnualExecutiveReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const isPastor =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<ExecutiveOverview>(
        `/analytics/overview?campusId=${encodeURIComponent(selectedCampus)}`,
      );
      setData(res);
    } catch (err) {
      console.error("Lỗi tải tổng quan chỉ huy mục vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnnualReport = async () => {
    setShowReportModal(true);
    setLoadingReport(true);
    try {
      const res = await apiFetch<AnnualExecutiveReport>(
        `/analytics/report/annual?campusId=${encodeURIComponent(selectedCampus)}&year=2026`,
      );
      setAnnualReport(res);
    } catch (err) {
      console.error("Lỗi lấy báo cáo thường niên:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    if (user && isPastor) {
      fetchOverview();
    }
  }, [user, selectedCampus]);

  if (!isPastor) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-700 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          {bilingual("Khu Vực Chỉ Huy Mục Vụ Giới Hạn Quyền", "Executive Ministry Cockpit - Restricted Access")}
        </h2>
        <p className="text-sm text-slate-600">
          {bilingual(
            "Trang chỉ huy sức khỏe Hội Thánh & phân tích chiến lược chỉ dành cho Mục Sư Quản Nhiệm, Ban Trị Sự và Các Trưởng Ban Mục Vụ.",
            "Church health diagnosis & strategic analytics are restricted to Senior Pastor, Church Board, and Ministry Leaders."
          )}
        </p>
        <Link href="/dashboard">
          <TactileButton variant="primary">
            {bilingual("Quay Về Trang Chủ", "Return to Home")}
          </TactileButton>
        </Link>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="py-24 text-center space-y-3 font-serif">
        <span className="text-3xl text-amber-700 font-serif animate-spin inline-block">†</span>
        <p className="text-sm text-slate-600 italic">
          {bilingual(
            '"Đang tổng hợp dữ liệu thuộc linh & tình hình Hội Thánh..."',
            '"Synthesizing spiritual metrics & church health overview..."'
          )}
        </p>
      </div>
    );
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-indigo-800 bg-indigo-50 border-indigo-200";
    if (score >= 50) return "text-amber-800 bg-amber-50 border-amber-300";
    return "text-red-700 bg-red-50 border-red-300";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner: Sacred Grace & Cockpit Vision */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white p-8 md:p-10 shadow-xl border border-amber-400/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-serif tracking-wider border border-amber-400/30">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {bilingual(
                  "BẢNG ĐIỀU HÀNH MỤC VỤ CẤP CAO • SENIOR PASTOR EXECUTIVE COCKPIT",
                  "SENIOR PASTOR EXECUTIVE COCKPIT • HIGH-LEVEL MINISTRY"
                )}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-100">
              {bilingual(
                "Chẩn Đoán Sức Khỏe Hội Thánh & Phân Tích Thuộc Linh",
                "Church Health Diagnosis & Spiritual Analytics"
              )}
            </h1>
            <p className="font-serif italic text-amber-200/90 text-sm md:text-base leading-relaxed">
              {data.biblicalVerdict}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-indigo-900/60 border border-amber-400/30 rounded-lg px-3 py-1.5 text-xs text-amber-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{bilingual("Khu vực quan sát:", "Observed Campus:")}</span>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="bg-transparent font-semibold text-amber-100 focus:outline-none cursor-pointer"
                >
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id} className="text-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <TactileButton
                variant="gold"
                size="sm"
                onClick={handleOpenAnnualReport}
                className="flex items-center gap-1.5 shadow-md"
              >
                <FileDown className="w-4 h-4 text-amber-950" />
                <span>
                  {bilingual("Xuất Báo Cáo Đại Hội Thường Niên", "Export Annual Business Report")}
                </span>
              </TactileButton>
            </div>
          </div>

          {/* Spiritual Health Score Dial */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-amber-400/40 text-center flex flex-col items-center justify-center min-w-[220px]">
            <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
              {bilingual("CHỈ SỐ SỨC KHỎE TỔNG THỂ", "OVERALL HEALTH SCORE")}
            </span>
            <div className="text-5xl font-serif font-bold text-amber-200 mt-1 mb-1">
              {data.overallHealthScore}
              <span className="text-2xl font-sans text-amber-400/80">/100</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-serif font-bold bg-amber-400/20 text-amber-200 border border-amber-400/40">
              {pick(data, "healthTierLabelVi", "healthTierLabelEn")}
            </span>
            <span className="text-[10px] text-slate-300 mt-2 font-mono">
              {bilingual("Tổng hợp từ 5 trụ cột mục vụ", "Aggregated from 5 ministry pillars")}
            </span>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-6 -bottom-10 opacity-5 pointer-events-none select-none text-white text-[160px] font-serif">
          †
        </div>
      </div>

      {/* Bento Grid: 4 Core Vital Signs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BentoCard
          title={bilingual("Tổng Tín Hữu Sinh Hoạt", "Active Congregation")}
          badge={<Users className="w-5 h-5 text-indigo-800" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900">
              {data.totalMembers}
            </span>
            <span className="text-xs text-slate-500">{bilingual("tín hữu", "members")}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              `${data.totalHouseholds} Hộ gia đình trong danh bạ`,
              `${data.totalHouseholds} Registered households`
            )}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Môn Đồ Đang Huấn Luyện", "Disciples In Training")}
          badge={<Compass className="w-5 h-5 text-emerald-700" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-emerald-800">
              {data.activeDisciples}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {bilingual("môn đồ / nhân sự", "disciples / workers")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual("Đang tham gia lộ trình môn đồ hóa", "Engaged in discipleship pathway")}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Cảnh Báo Cần Chăm Sóc", "Care & Visitation Alerts")}
          badge={
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
              {bilingual(`${data.atRiskCount} Tín Hữu`, `${data.atRiskCount} Members`)}
            </span>
          }
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-red-700">{data.atRiskCount}</span>
            <span className="text-xs text-red-600">
              {bilingual("nguy cơ nguội lạnh", "at-risk disengagement")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              "Cần Mục sư & Nhóm nhỏ thăm viếng",
              "Needs pastoral & small group care"
            )}
          </p>
        </BentoCard>

        <BentoCard
          title={bilingual("Dâng Hiến YTD (Stripe/ACH)", "YTD Giving (Stripe/ACH)")}
          badge={<DollarSign className="w-5 h-5 text-amber-800" />}
        >
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-amber-900">
              ${data.givingSummary.totalAmountYtd.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">USD</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {bilingual(
              `${data.givingSummary.totalDonors} tín hữu dâng hiến trung tín`,
              `${data.givingSummary.totalDonors} faithful givers`
            )}
          </p>
        </BentoCard>
      </div>

      {/* SECTION 1: 5 PILLARS OF SPIRITUAL HEALTH */}
      <section className="bg-white rounded-2xl border border-amber-200/80 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-serif font-bold uppercase tracking-wider">
              <span>†</span>
              <span>
                {bilingual(
                  "5 Trụ Cột Sức Khỏe Thuộc Linh Hội Thánh (5 Spiritual Pillars)",
                  "5 Spiritual Health Pillars of the Church"
                )}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900">
              {bilingual(
                "Đo Lường Sự Trưởng Thành & Đời Sống Đức Tin",
                "Measuring Spiritual Maturity & Faith Vitality"
              )}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {bilingual(
              "Trọng số chuẩn hóa theo mô hình Tăng Trưởng Lành Mạnh",
              "Normalized weights based on Healthy Growth Framework"
            )}
          </span>
        </div>

        <div className="space-y-5">
          {Object.values(data.pillars).map((p) => (
            <div
              key={p.key}
              className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-2 hover:bg-amber-50/70 transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    {pick(p, "labelVi", "labelEn")}
                  </h3>
                  <span className="text-xs text-slate-500 font-serif italic">
                    ({isEn ? p.labelVi : p.labelEn})
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                    {bilingual("Trọng số: ", "Weight: ")}{Math.round(p.weight * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreBadgeColor(
                      p.score,
                    )}`}
                  >
                    {p.score}/100
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    p.score >= 85
                      ? "bg-emerald-600"
                      : p.score >= 70
                      ? "bg-indigo-600"
                      : p.score >= 50
                      ? "bg-amber-600"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${p.score}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1 pt-1">
                <span className="font-medium text-slate-700">
                  {bilingual("Mục tiêu: ", "Benchmark: ")}{p.benchmark}
                </span>
                <span className="italic text-slate-500">
                  {bilingual("Nhận định: ", "Insight: ")}{p.insight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: AT-RISK MEMBERS & PATHWAY FUNNEL (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* At-Risk Predictive Watchlist */}
        <section className="bg-white rounded-2xl border border-red-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2 text-red-800">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {bilingual("Tín Hữu Nguy Cơ Nguội Lạnh Cần Thăm Viếng", "At-Risk Members Requiring Pastoral Care")}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-100 text-red-800">
                {bilingual(`${data.atRiskMembers.length} Ca cảnh báo`, `${data.atRiskMembers.length} Active Alerts`)}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Hệ thống phát hiện sớm các dấu hiệu giảm sút gắn kết (vắng nhóm ≥ 2 tuần, gián đoạn đọc Kinh Thánh, không có mặt trong lịch trực).",
                "Early detection of disengagement signals (absent ≥ 2 weeks, broken Bible reading streak, missing volunteer shifts)."
              )}
            </p>

            <div className="space-y-3 mt-3">
              {data.atRiskMembers.map((m) => (
                <div
                  key={m.userId}
                  className="p-4 rounded-xl bg-red-50/50 border border-red-200/70 space-y-2 hover:bg-red-50/80 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-slate-900 text-sm">
                        {m.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {m.email} • {m.phone || bilingual("Chưa có SĐT", "No phone")} ({m.campusId})
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-200 text-red-900">
                      {bilingual("Rủi ro: ", "Risk: ")}{m.riskScore}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    {m.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-red-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-red-100 flex items-center justify-between gap-2 text-xs">
                    <span className="italic text-slate-600 text-[11px]">
                      {bilingual("Kiến nghị: ", "Action: ")}<strong>{m.suggestedAction}</strong>
                    </span>
                    <Link href="/dashboard/pastoral">
                      <TactileButton variant="secondary" size="sm" className="text-xs py-1">
                        {bilingual("Lên Lịch Thăm Viếng", "Schedule Visit")}
                      </TactileButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-right">
            <Link
              href="/dashboard/pastoral"
              className="text-xs text-amber-800 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>{bilingual("Xem Sổ Chăm Sóc Mục Vụ & Gia Đình", "View Pastoral Care Journal & Families")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Discipleship Conversion Funnel */}
        <section className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2 text-indigo-950">
                <Compass className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {bilingual("Phễu Tăng Trưởng Môn Đồ Hóa (Pipeline)", "Discipleship Growth Funnel (Pipeline)")}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {bilingual("6 Cột Mốc Đức Tin", "6 Faith Milestones")}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {bilingual(
                "Theo dõi lộ trình từ khi một người biết đến Chúa cho đến khi trở thành lãnh đạo phụng sự trong Hội Thánh.",
                "Track the spiritual journey from seeker to ordained servant leader."
              )}
            </p>

            <div className="space-y-3 mt-3">
              {data.funnel.map((step, idx) => (
                <div key={step.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-indigo-950 text-amber-300 inline-flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      {pick(step, "titleVi", "titleEn")}
                    </span>
                    <span className="font-mono font-bold text-indigo-950">
                      {bilingual(`${step.count} người (${step.percentage}%)`, `${step.count} people (${step.percentage}%)`)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-indigo-800 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(step.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-right">
            <Link
              href="/dashboard/pathway"
              className="text-xs text-amber-800 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>{bilingual("Xem Chi Tiết Hành Trình Đức Tin & Báp-têm", "View Discipleship Pathway & Baptisms")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* SECTION 3: GIVING STEWARDSHIP & MULTI-CAMPUS (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Giving Allocation Breakdown */}
        <section className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2 text-indigo-950">
              <DollarSign className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {bilingual("Phân Bổ Quỹ Dâng Hiến & Truyền Giáo", "Giving & Missions Fund Allocation")}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              IRS 501(c)(3)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                {bilingual("Tổng Thu Nhận YTD", "Total Received YTD")}
              </span>
              <span className="text-xl font-serif font-bold text-amber-900">
                ${data.givingSummary.totalAmountYtd.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/70">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                {bilingual("Mức Dâng Trung Bình", "Average Donation")}
              </span>
              <span className="text-xl font-serif font-bold text-indigo-950">
                ${data.givingSummary.averageDonation.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {data.givingSummary.funds.map((f) => (
              <div key={f.fundType} className="p-3 rounded-lg bg-[#FAF8F5] border border-amber-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">{f.labelVi}</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${f.total.toLocaleString()} ({f.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-700 h-full rounded-full"
                    style={{ width: `${f.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-Campus Comparison */}
        <section className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2 text-indigo-950">
              <Building2 className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {bilingual("So Sánh Chỉ Số Giữa Các Điểm Nhóm", "Cross-Campus Health Comparison")}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">4 Campuses</span>
          </div>

          <div className="space-y-3">
            {data.campuses.map((c) => (
              <div
                key={c.campusId}
                className="p-3.5 rounded-xl border border-amber-200/70 bg-[#FCFBF8] flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    {c.campusName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {bilingual(
                      `${c.memberCount} Tín hữu • Tỷ lệ hiện diện: ${c.attendanceRate}%`,
                      `${c.memberCount} Members • Attendance rate: ${c.attendanceRate}%`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold border mb-1 ${getScoreBadgeColor(
                      c.healthScore,
                    )}`}
                  >
                    {bilingual(`Điểm: ${c.healthScore}/100`, `Score: ${c.healthScore}/100`)}
                  </span>
                  <p className="text-xs font-mono font-semibold text-slate-700">
                    ${c.totalGiving.toLocaleString()} YTD
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ANNUAL BUSINESS REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 border border-amber-300 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-amber-800 font-serif text-2xl font-bold">†</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    {bilingual("Báo Cáo Sức Khỏe Hội Thánh Đại Hội Thường Niên", "Annual Church Business & Spiritual Health Report")}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {bilingual("Báo cáo tài chính & sức khỏe mục vụ • Năm 2026", "Annual Church Business & Spiritual Health Report • Year 2026")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {loadingReport || !annualReport ? (
              <div className="py-12 text-center font-serif text-slate-500">
                <span className="text-2xl animate-spin inline-block text-amber-700">†</span>
                <p className="mt-2 text-sm italic">
                  {bilingual("Đang kết xuất văn bản báo cáo thường niên...", "Generating annual business report...")}
                </p>
              </div>
            ) : (
              <div className="space-y-6 pt-4 text-xs text-slate-700">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-amber-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm">
                      {annualReport.churchName}
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      {bilingual("Thời gian lập: ", "Generated at: ")}
                      {new Date(annualReport.generatedAt).toLocaleString(isEn ? "en-US" : "vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-amber-900">
                      {annualReport.executiveSummary.overallHealthScore}/100
                    </span>
                    <span className="block text-[11px] font-serif text-emerald-800 font-semibold">
                      {pick(annualReport.executiveSummary, "healthTierLabelVi", "healthTierLabelEn")}
                    </span>
                  </div>
                </div>

                {/* Section: Discipleship */}
                <div>
                  <h5 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 border-b pb-1">
                    {bilingual(
                      "1. Kết Quả Môn Đồ Hóa & Thuộc Linh (Discipleship Fruits)",
                      "1. Discipleship & Spiritual Fruits"
                    )}
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
                      <span className="text-lg font-bold text-slate-900">
                        {annualReport.discipleshipProgress.salvationsCount}
                      </span>
                      <span className="block text-[11px] text-slate-600">
                        {bilingual("Linh Hồn Tiếp Nhận Chúa", "Salvations / Decisions")}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-blue-50 border border-blue-200">
                      <span className="text-lg font-bold text-slate-900">
                        {annualReport.discipleshipProgress.baptismsCount}
                      </span>
                      <span className="block text-[11px] text-slate-600">
                        {bilingual("Báp-têm Nhân Danh Chúa", "Water Baptisms")}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                      <span className="text-lg font-bold text-slate-900">
                        {annualReport.discipleshipProgress.graduatedDisciplesCount}
                      </span>
                      <span className="block text-[11px] text-slate-600">
                        {bilingual("Tốt Nghiệp Khóa Môn Đồ", "Graduated Disciples")}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-indigo-50 border border-indigo-200">
                      <span className="text-lg font-bold text-slate-900">
                        {annualReport.discipleshipProgress.ordainedLeadersCount}
                      </span>
                      <span className="block text-[11px] text-slate-600">
                        {bilingual("Nhân Sự Bổ Nhiệm Mới", "Ordained Leaders")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Missions */}
                <div>
                  <h5 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 border-b pb-1">
                    {bilingual(
                      "2. Truyền Giáo & Thăm Viếng Mục Vụ (Missions & Outreach)",
                      "2. Missions & Pastoral Outreach"
                    )}
                  </h5>
                  <p className="leading-relaxed">
                    {bilingual(
                      `Hội Thánh đã dành ra tổng cộng $${annualReport.missionsAndOutreach.missionsGivingTotal.toLocaleString()} USD (tương đương ${annualReport.missionsAndOutreach.missionsPercentage}% tổng dâng hiến) cho công tác truyền giáo, cứu trợ và hỗ trợ các mục vụ hải ngoại. Đã hoàn tất ${annualReport.missionsAndOutreach.pastoralVisitsCompleted} buổi thăm viếng tại bệnh viện và tư gia theo khuôn mẫu Gia-cơ 5:14.`,
                      `The church has allocated a total of $${annualReport.missionsAndOutreach.missionsGivingTotal.toLocaleString()} USD (${annualReport.missionsAndOutreach.missionsPercentage}% of total tithes) for missions, benevolent relief, and global outreach. Completed ${annualReport.missionsAndOutreach.pastoralVisitsCompleted} pastoral visits to hospitals and homes according to James 5:14.`
                    )}
                  </p>
                </div>

                {/* Sign-off */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                  <div>
                    <p className="font-serif italic text-slate-500">
                      {bilingual("Soli Deo Gloria — Mọi Vinh Hiển Thuộc Về Chúa", "Soli Deo Gloria — Glory to God Alone")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-serif font-bold text-slate-900">{user?.fullName}</p>
                    <p className="text-[11px] text-slate-500">
                      {bilingual("Mục Sư Quản Nhiệm (Senior Pastor)", "Senior Pastor")}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <TactileButton
                    variant="secondary"
                    size="sm"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{bilingual("In Báo Cáo", "Print Report")}</span>
                  </TactileButton>
                  <TactileButton
                    variant="gold"
                    size="sm"
                    onClick={() => setShowReportModal(false)}
                  >
                    {bilingual("Đóng", "Close")}
                  </TactileButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
