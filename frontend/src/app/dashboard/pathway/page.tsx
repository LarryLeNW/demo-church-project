"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch, ApiError } from "@/lib/api/client";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { TactileInput } from "@/components/ui/tactile-input";
import {
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Wine,
  UserCheck,
  Award,
  Clock,
  Search,
  Filter,
  Check,
} from "lucide-react";

export type SpiritualStage =
  | "seeker"
  | "new_believer"
  | "baptism_candidate"
  | "baptized"
  | "disciple"
  | "ministry_leader";

export type BaptismStatus =
  | "not_started"
  | "enrolled_class"
  | "completed_class"
  | "baptized";

interface MilestoneHistoryItem {
  stage: SpiritualStage;
  title: string;
  achievedAt: string;
  notes?: string;
  verifiedBy?: string;
}

interface SpiritualProfile {
  id: string;
  userId: string;
  currentStage: SpiritualStage;
  baptismStatus: BaptismStatus;
  salvationDate: string | null;
  salvationTestimony: string | null;
  baptismDate: string | null;
  baptismClassCompletedAt: string | null;
  baptizedBy: string | null;
  communionEligible: boolean;
  mentorName: string | null;
  pastoralNotes: string | null;
  campusId: string;
  milestoneHistory: MilestoneHistoryItem[];
}

interface StageMeta {
  titleVi: string;
  titleEn: string;
  stepIndex: number;
  scriptureVi: string;
  scriptureEn: string;
  scriptureRef: string;
  descriptionVi: string;
}

interface MyProfileResponse {
  profile: SpiritualProfile;
  stageMeta: StageMeta;
  allStages: Record<SpiritualStage, StageMeta>;
}

interface PipelineOverview {
  total: number;
  seekerCount: number;
  newBelieverCount: number;
  baptismCandidateCount: number;
  baptizedCount: number;
  discipleCount: number;
  ministryLeaderCount: number;
  communionEligibleCount: number;
  inBaptismClassCount: number;
  readyForBaptismCount: number;
}

interface CandidateSummary {
  profile: SpiritualProfile;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    avatarUrl: string | null;
    campusId: string | null;
  };
  stageMeta: StageMeta;
}

const STAGES_ORDER: SpiritualStage[] = [
  "seeker",
  "new_believer",
  "baptism_candidate",
  "baptized",
  "disciple",
  "ministry_leader",
];

const CAMPUSES = [
  { id: "all", vi: "Tất cả các điểm nhóm (All Campuses)", en: "All Campuses" },
  { id: "Dallas Main Campus", vi: "Hội Thánh Dallas", en: "Dallas Main Campus" },
  { id: "Houston Campus", vi: "Hội Thánh Houston", en: "Houston Campus" },
  { id: "Fort Worth Campus", vi: "Hội Thánh Fort Worth", en: "Fort Worth Campus" },
  { id: "Austin Campus", vi: "Điểm Nhóm Sinh Viên Austin", en: "Austin Campus" },
];

export default function PathwayPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();
  const [profileData, setProfileData] = useState<MyProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingTestimony, setSavingTestimony] = useState(false);
  const [salvationDate, setSalvationDate] = useState("");
  const [testimony, setTestimony] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pastor & Leader Overview State
  const isPastorOrLeader =
    user?.role === "senior_pastor" ||
    user?.role === "admin" ||
    user?.role === "ministry_leader";

  const [overview, setOverview] = useState<PipelineOverview | null>(null);
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Verification Modal State
  const [verifyingCandidate, setVerifyingCandidate] = useState<CandidateSummary | null>(null);
  const [verifyStage, setVerifyStage] = useState<SpiritualStage>("baptized");
  const [verifyBaptismStatus, setVerifyBaptismStatus] = useState<BaptismStatus>("baptized");
  const [verifyBaptismDate, setVerifyBaptismDate] = useState("");
  const [verifyBaptizedBy, setVerifyBaptizedBy] = useState("");
  const [verifyCommunionEligible, setVerifyCommunionEligible] = useState(true);
  const [verifyNotes, setVerifyNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchMyProfile = async () => {
    try {
      const data = await apiFetch<MyProfileResponse>("/pathway/my-profile");
      setProfileData(data);
      if (data.profile.salvationDate) {
        setSalvationDate(data.profile.salvationDate);
      }
      if (data.profile.salvationTestimony) {
        setTestimony(data.profile.salvationTestimony);
      }
    } catch (err) {
      console.error("Không thể tải hồ sơ đức tin:", err);
    }
  };

  const fetchAdminData = async () => {
    if (!isPastorOrLeader) return;
    try {
      const candParams = new URLSearchParams();
      if (selectedCampus && selectedCampus !== "all") {
        candParams.append("campusId", selectedCampus);
      }
      if (filterStage && filterStage !== "all") {
        candParams.append("stage", filterStage);
      }
      if (searchQuery && searchQuery.trim()) {
        candParams.append("search", searchQuery.trim());
      }

      const overviewParams = new URLSearchParams();
      if (selectedCampus && selectedCampus !== "all") {
        overviewParams.append("campusId", selectedCampus);
      }

      const [ovData, candData] = await Promise.all([
        apiFetch<PipelineOverview>(
          `/pathway/admin/overview${overviewParams.toString() ? `?${overviewParams.toString()}` : ""}`,
        ),
        apiFetch<CandidateSummary[]>(
          `/pathway/admin/candidates${candParams.toString() ? `?${candParams.toString()}` : ""}`,
        ),
      ]);
      setOverview(ovData);
      setCandidates(candData);
    } catch (err) {
      console.error("Không thể tải danh sách pipeline:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchMyProfile();
      if (isPastorOrLeader) {
        await fetchAdminData();
      }
      setLoading(false);
    };
    init();
  }, [user]);

  useEffect(() => {
    if (isPastorOrLeader) {
      fetchAdminData();
    }
  }, [selectedCampus, filterStage, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTestimony(true);
    try {
      const updated = await apiFetch<SpiritualProfile>("/pathway/my-profile", {
        method: "PATCH",
        body: {
          salvationDate: salvationDate || undefined,
          salvationTestimony: testimony || undefined,
        },
      });
      setProfileData((prev) => (prev ? { ...prev, profile: updated } : null));
      showToast(bilingual("Đã lưu lời chứng đức tin thành công!", "Faith testimony saved successfully!"));
    } catch (err) {
      alert((err as ApiError).message || bilingual("Có lỗi xảy ra khi lưu lời chứng.", "Could not save testimony."));
    } finally {
      setSavingTestimony(false);
    }
  };

  const handleEnrollBaptismClass = async () => {
    if (
      !confirm(
        bilingual(
          "Bạn có muốn đăng ký tham gia Lớp Học Giáo Lý Báp-têm sắp tới không?",
          "Would you like to enroll in the upcoming Water Baptism Class?",
        ),
      )
    ) {
      return;
    }
    try {
      const updated = await apiFetch<SpiritualProfile>("/pathway/my-profile", {
        method: "PATCH",
        body: { enrollInBaptismClass: true },
      });
      setProfileData((prev) => (prev ? { ...prev, profile: updated } : null));
      showToast(
        bilingual(
          "Đã ghi danh tham dự lớp Giáo lý Báp-têm! Mục sư sẽ liên hệ cùng bạn.",
          "Enrolled in Baptism Class! A pastor will follow up with you.",
        ),
      );
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể đăng ký lớp báp-têm.", "Could not enroll in baptism class."));
    }
  };

  const openVerifyModal = (cand: CandidateSummary) => {
    setVerifyingCandidate(cand);
    setVerifyStage(
      cand.profile.currentStage === "baptism_candidate"
        ? "baptized"
        : cand.profile.currentStage,
    );
    setVerifyBaptismStatus("baptized");
    setVerifyBaptismDate(new Date().toISOString().split("T")[0]);
    setVerifyBaptizedBy(bilingual("Mục Sư Quản Nhiệm", "Senior Pastor"));
    setVerifyCommunionEligible(true);
    setVerifyNotes(
      cand.profile.currentStage === "baptism_candidate"
        ? bilingual(
            "Đã hoàn tất lớp giáo lý và chính thức nhận Thánh lễ Báp-têm trước sự chứng kiến của Hội Thánh.",
            "Completed catechism class and received Holy Baptism before the congregation."
          )
        : "",
    );
  };

  const handleConfirmVerification = async () => {
    if (!verifyingCandidate) return;
    setIsVerifying(true);
    try {
      await apiFetch(`/pathway/admin/verify/${verifyingCandidate.user.id}`, {
        method: "PATCH",
        body: {
          stage: verifyStage,
          baptismStatus: verifyBaptismStatus,
          baptismDate: verifyBaptismDate || undefined,
          baptizedBy: verifyBaptizedBy || undefined,
          communionEligible: verifyCommunionEligible,
          pastoralNotes: verifyNotes || undefined,
        },
      });
      showToast(
        bilingual(
          `Đã xác nhận cột mốc cho tín hữu ${verifyingCandidate.user.fullName}!`,
          `Milestone confirmed for disciple ${verifyingCandidate.user.fullName}!`,
        ),
      );
      setVerifyingCandidate(null);
      await Promise.all([fetchAdminData(), fetchMyProfile()]);
    } catch (err) {
      alert((err as ApiError).message || bilingual("Không thể cập nhật cột mốc.", "Could not update milestone."));
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <span className="text-amber-800 font-serif text-3xl animate-spin select-none">†</span>
        <span className="text-sm font-serif italic text-slate-600">
          {bilingual(
            '"Đang mở cuốn sổ sự sống và hành trình đức tin..."',
            '"Opening the book of life and faith pathway..."',
          )}
        </span>
      </div>
    );
  }

  const currentProfile = profileData?.profile;
  const currentStageMeta = profileData?.stageMeta;
  const currentStageIndex = STAGES_ORDER.indexOf(
    currentProfile?.currentStage || "new_believer",
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-white px-5 py-3 rounded-xl shadow-xl border border-amber-400/50 flex items-center gap-2.5 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-800 tracking-wider uppercase mb-1">
            <span>†</span>
            <span>{bilingual("Lộ Trình Môn Đồ Hóa • Discipleship Pathway", "Discipleship Pathway • Faith Journey")}</span>
          </div>
          <h1 className="font-scripture text-3xl font-bold text-slate-900 tracking-tight">
            {bilingual("Hành Trình Đức Tin & Cột Mốc Thuộc Linh", "Faith Journey & Spiritual Milestones")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {bilingual(
              "Theo dõi từng bước đi theo Chúa Jesus: từ Thân hữu → Tiếp nhận Chúa → Lớp Báp-têm → Dự Tiệc Thánh → Môn đồ phục vụ.",
              "Follow every step of walking with Jesus: from Seeker → New Believer → Baptism Class → Holy Communion → Serving Disciple.",
            )}
          </p>
        </div>

        {/* Holy Communion Eligible Badge */}
        <div className="shrink-0 flex items-center gap-3">
          <div
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 ${
              currentProfile?.communionEligible
                ? "bg-amber-50/90 border-amber-300 text-amber-900"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <Wine
              className={`w-5 h-5 ${
                currentProfile?.communionEligible ? "text-amber-700" : "text-slate-400"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {bilingual("Thánh Lễ Tiệc Thánh", "Holy Communion")}
              </span>
              <span className="text-xs font-medium">
                {currentProfile?.communionEligible
                  ? bilingual("✓ Đủ tư cách dự Tiệc Thánh", "✓ Communion Eligible")
                  : bilingual("Chờ xác nhận Báp-têm", "Awaiting Baptism")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. VISUAL STEP-BY-STEP FAITH TIMELINE */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-800" />
            <h2 className="font-scripture text-xl font-bold text-slate-900">
              {bilingual("Cột Mốc Tiến Trình Môn Đồ Hóa", "Discipleship Milestone Progression")}
            </h2>
          </div>
          <span className="text-xs font-serif italic text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {isEn ? (currentStageMeta?.titleEn || currentStageMeta?.titleVi) : currentStageMeta?.titleVi}
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {STAGES_ORDER.map((stageKey, idx) => {
              const meta = profileData?.allStages[stageKey];
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stageKey}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    isCurrent
                      ? "bg-indigo-950 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30"
                      : isPast
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                      : "bg-slate-50/60 border-slate-200 text-slate-500 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? "bg-amber-400 text-indigo-950"
                          : isPast
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isCurrent
                          ? "text-amber-300"
                          : isPast
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {isCurrent
                        ? bilingual("Đang Ở Bước Này", "Current Step")
                        : isPast
                        ? bilingual("Đã Đạt", "Completed")
                        : bilingual("Kế Tiếp", "Next")}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-scripture text-sm font-bold leading-tight ${
                        isCurrent ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {isEn ? (meta?.titleEn || meta?.titleVi) : meta?.titleVi}
                    </h3>
                    <p
                      className={`text-[10px] mt-1 ${
                        isCurrent ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {isEn ? meta?.titleVi : meta?.titleEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Stage Scripture Banner */}
        {currentStageMeta && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border border-amber-200/90 text-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-900 uppercase tracking-widest">
              <span>†</span>
              <span>{bilingual("Lời Chúa Khích Lệ Bạn Hôm Nay:", "Scripture Encouragement Today:")}</span>
            </div>
            <p className="font-scripture italic text-base sm:text-lg text-slate-900 leading-relaxed">
              "{isEn ? currentStageMeta.scriptureEn : currentStageMeta.scriptureVi}"
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600 font-serif">
              <span>{isEn ? currentStageMeta.scriptureVi : currentStageMeta.scriptureEn}</span>
              <span className="font-bold text-amber-900">
                — {currentStageMeta.scriptureRef}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 2. PERSONAL TESTIMONY & BAPTISM ENROLLMENT (MEMBER ACTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Personal Testimony & Details */}
        <div className="lg:col-span-2 space-y-6">
          <BentoCard
            title={bilingual("Lời Chứng Tin Nhận Chúa Của Tôi (My Testimony)", "My Salvation Testimony")}
            badge={<BookOpen className="w-5 h-5 text-amber-800" />}
            className="p-6"
          >
            <form onSubmit={handleSaveTestimony} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Ngày Bạn Tiếp Nhận Chúa Jesus:", "Salvation / Decision Date:")}
                  </label>
                  <TactileInput
                    type="date"
                    value={salvationDate}
                    onChange={(e) => setSalvationDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Điểm Nhóm Đang Sinh Hoạt (Campus):", "Active Campus:")}
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-amber-200/80 text-xs font-medium text-slate-800">
                    {currentProfile?.campusId || "Dallas Main Campus"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual(
                    "Chia Sẻ Lời Chứng Về Tình Yêu & Sự Biến Đổi Của Chúa:",
                    "Share Your Testimony of God's Transforming Love:",
                  )}
                </label>
                <textarea
                  rows={4}
                  value={testimony}
                  onChange={(e) => setTestimony(e.target.value)}
                  placeholder={bilingual(
                    "Tôi đã gặp Chúa như thế nào, và Chúa đã giải cứu hay an ủi đời sống tôi ra sao...",
                    "How I encountered Christ, and how He transformed and comforted my life...",
                  )}
                  className="w-full p-3.5 rounded-xl bg-[#FCFBF8] border border-amber-200/80 focus:border-indigo-900 focus:outline-none text-xs sm:text-sm text-slate-800 leading-relaxed font-sans placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-serif italic text-slate-500">
                  {bilingual(
                    "* Lời chứng của bạn là nguồn khích lệ lớn cho các anh chị em trong Hội Thánh.",
                    "* Your testimony is a powerful encouragement to brothers and sisters in Christ.",
                  )}
                </span>
                <TactileButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={savingTestimony}
                >
                  {savingTestimony
                    ? bilingual("Đang lưu...", "Saving...")
                    : bilingual("Lưu Lời Chứng Đức Tin", "Save Testimony")}
                </TactileButton>
              </div>
            </form>
          </BentoCard>

          {/* Milestone History Timeline */}
          <BentoCard
            title={bilingual("Nhật Ký Cột Mốc Đức Tin Đã Ghi Nhận", "Recorded Faith Milestones")}
            badge={<Award className="w-5 h-5 text-amber-800" />}
            className="p-6"
          >
            <div className="space-y-4">
              {currentProfile?.milestoneHistory &&
              currentProfile.milestoneHistory.length > 0 ? (
                currentProfile.milestoneHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-amber-200/60"
                  >
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-scripture text-sm font-bold text-slate-900">
                          {m.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(m.achievedAt).toLocaleDateString(isEn ? "en-US" : "vi-VN")}
                        </span>
                      </div>
                      {m.notes && (
                        <p className="text-xs text-slate-600 mt-1">{m.notes}</p>
                      )}
                      {m.verifiedBy && (
                        <span className="inline-block mt-1 text-[10px] text-indigo-950 font-serif font-bold">
                          {bilingual("Chứng nhận bởi:", "Verified by:")} {m.verifiedBy}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">
                  {bilingual(
                    "Chưa có cột mốc lịch sử nào được ghi nhận.",
                    "No faith milestones recorded yet.",
                  )}
                </p>
              )}
            </div>
          </BentoCard>
        </div>

        {/* Right 1 Col: Baptism Class Callout Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-white border border-amber-400/40 shadow-md space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold tracking-widest uppercase border border-amber-400/30">
              <span>†</span>
              <span>{bilingual("Lễ Báp-têm Mùa Phục Sinh & Giáng Sinh", "Easter & Christmas Water Baptism")}</span>
            </div>

            <h3 className="font-scripture text-xl font-bold leading-tight">
              {bilingual("Đăng Ký Học Lớp Giáo Lý Báp-Têm", "Enroll in Water Baptism Class")}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {bilingual(
                "Thánh lễ Báp-têm là mạng lệnh của Cứu Chúa Jesus để tuyên xưng đức tin công khai trước Hội Thánh và bước vào đời sống mới trong Đấng Christ.",
                "Water baptism is Christ's command to publicly confess faith before the Church and walk in newness of life.",
              )}
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>{bilingual("Thời gian học:", "Class Duration:")}</span>
                <span className="font-bold text-amber-300">
                  {bilingual("4 tuần (Chúa Nhật)", "4 weeks (Sundays)")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{bilingual("Tài liệu:", "Study Guide:")}</span>
                <span className="font-bold text-white">
                  {bilingual("Căn Bản Giáo Lý Đức Tin", "Foundations of Faith")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{bilingual("Trạng thái của bạn:", "Your status:")}</span>
                <span className="font-bold text-amber-300 uppercase text-[10px]">
                  {currentProfile?.baptismStatus === "enrolled_class"
                    ? bilingual("Đã Ghi Danh Lớp Học", "Enrolled in Class")
                    : currentProfile?.baptismStatus === "baptized"
                    ? bilingual("Đã Nhận Báp-Têm", "Baptized Member")
                    : bilingual("Chưa Đăng Ký", "Not Registered")}
                </span>
              </div>
            </div>

            {currentProfile?.baptismStatus === "not_started" && (
              <TactileButton
                variant="gold"
                size="md"
                onClick={handleEnrollBaptismClass}
                className="w-full justify-center"
              >
                <span>{bilingual("Đăng Ký Tham Gia Lớp Ngay", "Enroll in Baptism Class Now")}</span>
              </TactileButton>
            )}

            {currentProfile?.baptismStatus === "enrolled_class" && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {bilingual(
                    "Bạn đã ghi danh. Mục sư và Ban Cơ Đốc Giáo Dục sẽ liên hệ sắp xếp buổi học.",
                    "You are enrolled. Pastoral team will contact you to confirm class schedule.",
                  )}
                </span>
              </div>
            )}

            {currentProfile?.baptismDate && (
              <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs space-y-1">
                <p className="font-bold">
                  {bilingual("Đã Báp-têm ngày:", "Baptized on:")} {currentProfile.baptismDate}
                </p>
                {currentProfile.baptizedBy && (
                  <p className="text-[11px] text-slate-300">
                    {bilingual("Người thực hiện:", "Officiated by:")} {currentProfile.baptizedBy}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Holy Communion Info Card */}
          <div className="p-5 rounded-2xl bg-[#FCFBF8] border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-950">
              <Wine className="w-5 h-5 text-amber-800" />
              <h4 className="font-scripture text-base font-bold text-slate-900">
                {bilingual("Ý Nghĩa Thánh Lễ Tiệc Thánh", "The Meaning of Holy Communion")}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif">
              {bilingual(
                '"Nầy là thân thể ta, vì các ngươi mà phó cho; hãy làm sự nầy để nhớ đến ta... Chén nầy là giao ước mới trong huyết ta..." — 1 Cô-rinh-tô 11:24-25',
                '"This is my body, which is for you; do this in remembrance of me... This cup is the new covenant in my blood..." — 1 Corinthians 11:24-25',
              )}
            </p>
            <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
              {bilingual(
                "Thánh lễ Tiệc Thánh được cử hành vào mỗi Chúa Nhật đầu tháng tại tất cả các điểm nhóm của Hội Thánh.",
                "Holy Communion is celebrated on the first Sunday of every month across all church campuses.",
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PASTOR & MINISTRY LEADER PIPELINE DASHBOARD (RBAC) */}
      {isPastorOrLeader && (
        <section className="space-y-6 pt-6 border-t border-amber-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-800 uppercase tracking-wider">
                <span>†</span>
                <span>{bilingual("Dành Cho Mục Sư & Ban Trị Sự • Pastoral Discipleship Pipeline", "Pastoral Discipleship Pipeline • Church Leadership")}</span>
              </div>
              <h2 className="font-scripture text-2xl font-bold text-slate-900">
                {bilingual("Điều Phối & Chứng Nhận Cột Mốc Môn Đồ", "Pastoral Pipeline & Milestone Verification")}
              </h2>
            </div>

            {/* Campus Selector (Sprint 3.4 Multi-Campus) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-slate-700 whitespace-nowrap">
                {bilingual("Điểm Nhóm:", "Campus:")}
              </span>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-950"
              >
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isEn ? c.en : c.vi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overview Metrics Bento Cards */}
          {overview && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Tổng Hồ Sơ Môn Đồ", "Total Disciples")}
                </span>
                <p className="font-scripture text-2xl font-bold text-slate-900 mt-1">
                  {overview.total}
                </p>
                <span className="text-[10px] text-slate-400">
                  {bilingual("Đã đăng ký sinh hoạt", "Active discipleship records")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Tân Tín Hữu", "New Believers")}
                </span>
                <p className="font-scripture text-2xl font-bold text-amber-800 mt-1">
                  {overview.newBelieverCount}
                </p>
                <span className="text-[10px] text-slate-400">
                  {bilingual("Mới tiếp nhận Chúa", "Recently accepted Christ")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Đang Học Lớp Báp-têm", "In Baptism Class")}
                </span>
                <p className="font-scripture text-2xl font-bold text-indigo-950 mt-1">
                  {overview.inBaptismClassCount}
                </p>
                <span className="text-[10px] text-indigo-900 font-semibold">
                  {bilingual("Chuẩn bị nhận Thánh lễ", "Preparing for baptism")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Đã Báp-têm", "Baptized Members")}
                </span>
                <p className="font-scripture text-2xl font-bold text-emerald-700 mt-1">
                  {overview.baptizedCount + overview.discipleCount}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {overview.communionEligibleCount} {bilingual("được dự Tiệc Thánh", "communion eligible")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
                <span className="text-xs text-slate-500 font-serif">
                  {bilingual("Nhân Sự & Lãnh Đạo", "Ministry Leaders")}
                </span>
                <p className="font-scripture text-2xl font-bold text-purple-900 mt-1">
                  {overview.ministryLeaderCount}
                </p>
                <span className="text-[10px] text-purple-800 font-medium">
                  {bilingual("Trưởng ban / Giáo viên", "Department leaders / teachers")}
                </span>
              </div>
            </div>
          )}

          {/* Filters & Candidates List */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: "all", vi: "Tất cả", en: "All" },
                  { id: "baptism_candidate", vi: "Ứng Viên Báp-têm", en: "Baptism Candidates" },
                  { id: "new_believer", vi: "Tân Tín Hữu", en: "New Believers" },
                  { id: "baptized", vi: "Đã Báp-têm", en: "Baptized Members" },
                  { id: "disciple", vi: "Môn Đồ", en: "Devoted Disciples" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterStage(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      filterStage === f.id
                        ? "bg-indigo-950 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-amber-100"
                    }`}
                  >
                    {isEn ? f.en : f.vi}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={bilingual("Tìm theo tên hoặc email...", "Search by name or email...")}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-950"
                />
              </div>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-amber-200 text-slate-500 font-serif">
                    <th className="pb-3 font-semibold">{bilingual("Tín Hữu / Môn Đồ", "Disciple / Member")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Điểm Nhóm (Campus)", "Campus")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Giai Đoạn Hiện Tại", "Current Stage")}</th>
                    <th className="pb-3 font-semibold">{bilingual("Báp-têm & Tiệc Thánh", "Baptism & Communion")}</th>
                    <th className="pb-3 font-semibold text-right">{bilingual("Thao Tác Mục Vụ", "Pastoral Action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/70">
                  {candidates.map((cand) => (
                    <tr key={cand.profile.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{cand.user.fullName}</span>
                          <span className="text-[11px] text-slate-500">{cand.user.email}</span>
                          {cand.user.phone && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {cand.user.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-700 font-medium">
                        {cand.profile.campusId || "Dallas Main Campus"}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                          {isEn ? (cand.stageMeta.titleEn || cand.stageMeta.titleVi) : cand.stageMeta.titleVi}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-slate-800">
                            {cand.profile.baptismStatus === "baptized"
                              ? bilingual("✓ Đã Báp-têm", "✓ Baptized")
                              : cand.profile.baptismStatus === "enrolled_class"
                              ? bilingual("⏳ Đang học lớp Báp-têm", "⏳ In Baptism Class")
                              : bilingual("Chưa học", "Not Enrolled")}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {cand.profile.communionEligible
                              ? bilingual("Được dự Tiệc Thánh", "Communion Eligible")
                              : bilingual("Chưa dự Tiệc Thánh", "Not Eligible")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => openVerifyModal(cand)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-300" />
                          <span>{bilingual("Chứng Nhận / Chuyển Bước", "Verify / Advance Step")}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                        {bilingual(
                          "Không tìm thấy tín hữu nào phù hợp với bộ lọc hiện tại.",
                          "No members found matching current filter.",
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 4. MODAL: VERIFY MILESTONE & BAPTISM (PASTOR ACTION) */}
      {verifyingCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-800" />
                <h3 className="font-scripture text-lg font-bold text-slate-900">
                  {bilingual("Xác Nhận Cột Mốc Môn Đồ & Báp-têm", "Verify Milestone & Water Baptism")}
                </h3>
              </div>
              <button
                onClick={() => setVerifyingCandidate(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs bg-amber-50 p-3 rounded-xl border border-amber-200/60 text-slate-800">
              <p>
                <strong>{bilingual("Tín hữu:", "Member:")}</strong> {verifyingCandidate.user.fullName} ({verifyingCandidate.user.email})
              </p>
              <p className="mt-0.5">
                <strong>{bilingual("Điểm nhóm:", "Campus:")}</strong> {verifyingCandidate.profile.campusId || "Dallas Main Campus"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Chuyển Sang Giai Đoạn Thuộc Linh:", "Advance to Spiritual Stage:")}
                </label>
                <select
                  value={verifyStage}
                  onChange={(e) => setVerifyStage(e.target.value as SpiritualStage)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950"
                >
                  <option value="new_believer">{bilingual("Tân Tín Hữu (New Believer)", "New Believer")}</option>
                  <option value="baptism_candidate">{bilingual("Đang Học Lớp Báp-têm (Baptism Candidate)", "Baptism Candidate")}</option>
                  <option value="baptized">{bilingual("Đã Báp-têm & Dự Tiệc Thánh (Baptized Member)", "Baptized Member")}</option>
                  <option value="disciple">{bilingual("Môn Đồ Trưởng Thành (Devoted Disciple)", "Devoted Disciple")}</option>
                  <option value="ministry_leader">{bilingual("Nhân Sự & Lãnh Đạo Mục Vụ (Ministry Leader)", "Ministry Leader")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Trạng Thái Báp-têm:", "Baptism Status:")}
                  </label>
                  <select
                    value={verifyBaptismStatus}
                    onChange={(e) => setVerifyBaptismStatus(e.target.value as BaptismStatus)}
                    className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950"
                  >
                    <option value="enrolled_class">{bilingual("Đang học lớp Báp-têm", "Enrolled in class")}</option>
                    <option value="completed_class">{bilingual("Đã hoàn thành lớp học", "Completed class")}</option>
                    <option value="baptized">{bilingual("Đã nhận Thánh lễ Báp-têm", "Water baptized")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                    {bilingual("Ngày Báp-têm:", "Baptism Date:")}
                  </label>
                  <input
                    type="date"
                    value={verifyBaptismDate}
                    onChange={(e) => setVerifyBaptismDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual("Mục Sư / Người Làm Báp-têm:", "Officiating Pastor:")}
                </label>
                <input
                  type="text"
                  value={verifyBaptizedBy}
                  onChange={(e) => setVerifyBaptizedBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="communionCheck"
                  checked={verifyCommunionEligible}
                  onChange={(e) => setVerifyCommunionEligible(e.target.checked)}
                  className="w-4 h-4 accent-indigo-900 rounded cursor-pointer"
                />
                <label
                  htmlFor="communionCheck"
                  className="text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  {bilingual(
                    "Cấp tư cách chính thức dự Thánh Lễ Tiệc Thánh (Communion Eligible)",
                    "Grant Holy Communion Eligibility",
                  )}
                </label>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-800 mb-1">
                  {bilingual(
                    "Ghi Chú Mục Vụ (Lưu vào hồ sơ cột mốc):",
                    "Pastoral Notes (Saved to milestone history):",
                  )}
                </label>
                <textarea
                  rows={2}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder={bilingual(
                    "Ghi chú xác nhận của Mục sư...",
                    "Pastoral affirmation and blessings...",
                  )}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-950 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200/80">
              <button
                type="button"
                onClick={() => setVerifyingCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {bilingual("Hủy Bỏ", "Cancel")}
              </button>
              <TactileButton
                variant="gold"
                size="md"
                onClick={handleConfirmVerification}
                disabled={isVerifying}
              >
                {isVerifying
                  ? bilingual("Đang xác nhận...", "Verifying...")
                  : bilingual("Xác Nhận Cột Mốc", "Confirm Milestone")}
              </TactileButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
