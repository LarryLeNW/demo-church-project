"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { BentoCard } from "@/components/ui/bento-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { DevotionalStreakBadge } from "@/components/devotional-streak-badge";
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Calendar,
  PenTool,
  Save,
  Trash2,
  Lock,
  Plus,
  Compass,
  ArrowRight,
  Flame,
} from "lucide-react";

interface PlanDayReading {
  id: string;
  planId: string;
  dayNumber: number;
  title: string;
  passageOldTestament: string | null;
  passageNewTestament: string | null;
  passagePsalmProverbs: string | null;
  keyVerseText: string | null;
  reflectionPrompt: string | null;
}

interface BiblePlan {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  durationDays: number;
  category: string;
  thumbnailUrl: string | null;
  readingsCount?: number;
  readings?: PlanDayReading[];
}

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  completedDays: number[];
  isCompleted: boolean;
  completedCount: number;
  percentComplete: number;
  plan: BiblePlan;
}

interface DevotionalJournalItem {
  id: string;
  planId: string | null;
  dayNumber: number | null;
  passage: string;
  title: string;
  rhemaWord: string;
  observation: string;
  application: string;
  prayer: string;
  isPrivate: boolean;
  createdAt: string;
}

const CATEGORY_NAMES: Record<string, { vi: string; en: string }> = {
  one_year: { vi: "Trọn Năm (365 Ngày)", en: "Whole Year (365 Days)" },
  gospels: { vi: "Bốn Sách Phúc Âm", en: "The 4 Gospels" },
  wisdom: { vi: "Thi Thiên & Châm Ngôn", en: "Psalms & Proverbs" },
  epistles: { vi: "Thư Tín Tân Ước", en: "New Testament Epistles" },
  thematic: { vi: "Theo Chủ Đề", en: "Topical / Thematic" },
};

export default function BibleReadingPage() {
  const { user } = useAuth();
  const { bilingual, isEn } = useLanguage();

  // Tabs: 'today' | 'plans' | 'journals'
  const [activeTab, setActiveTab] = useState<"today" | "plans" | "journals">("today");

  // Plans & Subscriptions
  const [plans, setPlans] = useState<BiblePlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [activeSub, setActiveSub] = useState<UserSubscription | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Journal form states (SOAP method)
  const [journalTitle, setJournalTitle] = useState("");
  const [journalPassage, setJournalPassage] = useState("");
  const [soapScripture, setSoapScripture] = useState("");
  const [soapObservation, setSoapObservation] = useState("");
  const [soapApplication, setSoapApplication] = useState("");
  const [soapPrayer, setSoapPrayer] = useState("");
  const [savingJournal, setSavingJournal] = useState(false);
  const [journalSavedSuccess, setJournalSavedSuccess] = useState(false);

  // User Journals
  const [journals, setJournals] = useState<DevotionalJournalItem[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(false);

  // Toggle Day completion
  const [togglingDay, setTogglingDay] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load plans
      const plansData = await apiFetch<BiblePlan[]>("/bible/plans", { auth: false });
      setPlans(plansData || []);

      // 2. Load my subscriptions if logged in
      if (user) {
        const subsData = await apiFetch<UserSubscription[]>("/bible/my-plans");
        setSubscriptions(subsData || []);

        if (subsData && subsData.length > 0) {
          setActiveSub(subsData[0]);
          const currentReadingDay = (subsData[0].completedDays?.length || 0) + 1;
          setSelectedDayNumber(currentReadingDay);
        } else if (plansData && plansData.length > 0) {
          // Auto subscribe to the first plan for seamless experience
          try {
            const newSub = await apiFetch<UserSubscription>(
              `/bible/plans/${plansData[0].id}/subscribe`,
              { method: "POST" },
            );
            const enriched = {
              ...newSub,
              completedCount: 0,
              percentComplete: 0,
              plan: plansData[0],
            };
            setSubscriptions([enriched]);
            setActiveSub(enriched);
            setSelectedDayNumber(1);
          } catch {
            // fallback
          }
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const loadJournals = async () => {
    if (!user) return;
    setLoadingJournals(true);
    try {
      const res = await apiFetch<DevotionalJournalItem[]>("/bible/journal");
      setJournals(res || []);
    } catch {
      // fallback
    } finally {
      setLoadingJournals(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (activeTab === "journals") {
      loadJournals();
    }
  }, [activeTab]);

  const activeDayReading = activeSub?.plan?.readings?.find(
    (r) => r.dayNumber === selectedDayNumber,
  );

  useEffect(() => {
    if (activeDayReading) {
      const defaultPassage = [
        activeDayReading.passageOldTestament,
        activeDayReading.passageNewTestament,
        activeDayReading.passagePsalmProverbs,
      ]
        .filter(Boolean)
        .join(" & ");

      setJournalPassage(defaultPassage);
      setJournalTitle(`${bilingual("Tĩnh nguyện", "Devotion")}: ${activeDayReading.title}`);
    }
  }, [activeDayReading]);

  const isCurrentDayCompleted =
    activeSub?.completedDays?.includes(selectedDayNumber) || false;

  const handleToggleDay = async () => {
    if (!activeSub) return;
    setTogglingDay(true);
    try {
      const newStatus = !isCurrentDayCompleted;
      const updatedSub = await apiFetch<UserSubscription>(
        `/bible/plans/${activeSub.planId}/days/${selectedDayNumber}/toggle-complete`,
        {
          method: "POST",
          body: JSON.stringify({ isCompleted: newStatus }),
        },
      );

      // Refresh subscriptions
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === updatedSub.id ? { ...s, ...updatedSub } : s)),
      );
      setActiveSub((prev) => (prev ? { ...prev, ...updatedSub } : null));
    } catch {
      // error
    } finally {
      setTogglingDay(false);
    }
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle.trim() || !soapScripture.trim() || !soapPrayer.trim()) return;

    setSavingJournal(true);
    try {
      await apiFetch("/bible/journal", {
        method: "POST",
        body: JSON.stringify({
          planId: activeSub?.planId || null,
          dayNumber: selectedDayNumber,
          passage: journalPassage.trim() || bilingual("Kinh Thánh", "Holy Scripture"),
          title: journalTitle.trim(),
          rhemaWord: soapScripture.trim(),
          observation: soapObservation.trim(),
          application: soapApplication.trim(),
          prayer: soapPrayer.trim(),
          isPrivate: true,
        }),
      });

      setJournalSavedSuccess(true);
      setTimeout(() => setJournalSavedSuccess(false), 3500);
      loadJournals();
    } catch {
      // error
    } finally {
      setSavingJournal(false);
    }
  };

  const handleSubscribePlan = async (planId: string) => {
    try {
      await apiFetch(`/bible/plans/${planId}/subscribe`, { method: "POST" });
      loadData();
      setActiveTab("today");
    } catch {
      // error
    }
  };

  const handleDeleteJournal = async (journalId: string) => {
    try {
      await apiFetch(`/bible/journal/${journalId}`, { method: "DELETE" });
      setJournals((prev) => prev.filter((j) => j.id !== journalId));
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-8">
      {/* Sacred Grace Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white rounded-2xl border border-amber-400/30 shadow-md shadow-indigo-950/20">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-serif uppercase tracking-widest">
            <span>†</span>
            <span>{bilingual("Bánh Sự Sống Cho Linh Hồn Hằng Ngày", "Daily Bread for the Soul")}</span>
          </div>
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight">
            {bilingual("Kế Hoạch Đọc Kinh Thánh & Nhật Ký Tĩnh Nguyện", "Bible Reading Plans & Devotional Journal")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {bilingual(
              '"Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi." — Thi Thiên 119:105',
              '"Your word is a lamp for my feet, a light on my path." — Psalm 119:105'
            )}
          </p>

          {/* Plan progress snapshot */}
          {activeSub && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-amber-300/30 text-xs flex items-center gap-2 backdrop-blur-xs">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>
                  {bilingual("Đang Đọc: ", "Current Plan: ")}<strong>{activeSub.plan?.title}</strong>
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs flex items-center gap-2 backdrop-blur-xs text-amber-200">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>
                  {bilingual("Tiến Độ: ", "Progress: ")}<strong>{activeSub.percentComplete}%</strong> ({activeSub.completedCount || 0} /{" "}
                  {activeSub.plan?.durationDays} {bilingual("ngày", "days")})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="absolute right-6 -bottom-8 text-amber-500/10 font-serif text-9xl select-none pointer-events-none">
          †
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "today"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>{bilingual("Phòng Tĩnh Nguyện Hôm Nay", "Today's Sanctuary Reading")}</span>
          </button>

          <button
            onClick={() => setActiveTab("plans")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "plans"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-700" />
            <span>{bilingual(`Khám Phá Kế Hoạch Đọc (${plans.length})`, `Explore Plans (${plans.length})`)}</span>
          </button>

          <button
            onClick={() => setActiveTab("journals")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "journals"
                ? "bg-indigo-950 text-white shadow-xs"
                : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <PenTool className="w-4 h-4 text-amber-700" />
            <span>{bilingual(`Sổ Tay Tĩnh Nguyện Của Tôi (${journals.length})`, `My SOAP Journals (${journals.length})`)}</span>
          </button>
        </div>

        <div className="shrink-0 flex items-center">
          <DevotionalStreakBadge />
        </div>
      </div>

      {/* TAB 1: TODAY'S READING & SOAP JOURNAL */}
      {activeTab === "today" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Today's Scripture Passages (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeSub ? (
              <>
                {/* Day Selector Ribbon */}
                <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-800 font-serif font-bold text-lg">†</span>
                    <span className="font-scripture font-bold text-sm text-slate-900">
                      {bilingual("Chọn Ngày Đọc:", "Select Day:")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                      const isDone = activeSub.completedDays?.includes(day);
                      const isCurrent = selectedDayNumber === day;

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDayNumber(day)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-indigo-950 text-amber-300 shadow-sm"
                              : isDone
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-[#FCFBF8] text-slate-700 border border-amber-200 hover:bg-amber-100/60"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main Reading Card */}
                {activeDayReading ? (
                  <div className="bg-white rounded-3xl border-2 border-amber-300/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-serif">
                          {activeSub.plan?.title}
                        </span>
                        <h2 className="font-scripture text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                          {activeDayReading.title}
                        </h2>
                      </div>

                      <TactileButton
                        variant={isCurrentDayCompleted ? "gold" : "primary"}
                        size="md"
                        onClick={handleToggleDay}
                        disabled={togglingDay}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        <span>
                          {isCurrentDayCompleted
                            ? bilingual("Đã Đọc Xong ✓", "Completed ✓")
                            : bilingual("Đánh Dấu Đã Đọc Xong", "Mark as Completed")}
                        </span>
                      </TactileButton>
                    </div>

                    {/* Passages Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeDayReading.passageOldTestament && (
                        <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/80 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                            {bilingual("Cựu Ước", "Old Testament")}
                          </span>
                          <h4 className="font-scripture text-base font-bold text-slate-900">
                            {activeDayReading.passageOldTestament}
                          </h4>
                        </div>
                      )}

                      {activeDayReading.passageNewTestament && (
                        <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/80 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">
                            {bilingual("Tân Ước", "New Testament")}
                          </span>
                          <h4 className="font-scripture text-base font-bold text-slate-900">
                            {activeDayReading.passageNewTestament}
                          </h4>
                        </div>
                      )}

                      {activeDayReading.passagePsalmProverbs && (
                        <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/80 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                            {bilingual("Thi Thiên / Châm Ngôn", "Psalms & Proverbs")}
                          </span>
                          <h4 className="font-scripture text-base font-bold text-slate-900">
                            {activeDayReading.passagePsalmProverbs}
                          </h4>
                        </div>
                      )}
                    </div>

                    {/* Key Verse Highlight */}
                    {activeDayReading.keyVerseText && (
                      <div className="p-5 rounded-2xl bg-[#FCFBF8] border-2 border-amber-200 space-y-2 relative overflow-hidden">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-serif flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                          <span>{bilingual("Câu Gốc Trọng Tâm Hôm Nay", "Today's Key Scripture Verse")}</span>
                        </div>
                        <blockquote className="font-scripture text-base sm:text-lg text-slate-900 italic font-medium leading-relaxed">
                          "{activeDayReading.keyVerseText}"
                        </blockquote>
                      </div>
                    )}

                    {/* Reflection Prompt */}
                    {activeDayReading.reflectionPrompt && (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                        <span className="text-xs font-bold text-amber-950 font-serif">
                          💡 {bilingual("Câu Hỏi Suy Ngẫm Cho Buổi Tĩnh Nguyện:", "Devotional Reflection Prompt:")}
                        </span>
                        <p className="text-xs sm:text-sm text-amber-950 font-serif leading-relaxed">
                          {activeDayReading.reflectionPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/80 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto text-amber-700/60" />
                    <h3 className="font-scripture text-lg font-bold text-slate-900">
                      {bilingual(`Chưa có dữ liệu bài đọc cho ngày ${selectedDayNumber}`, `No reading data for day ${selectedDayNumber}`)}
                    </h3>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/80 space-y-4">
                <BookMarked className="w-12 h-12 mx-auto text-amber-700/60" />
                <h3 className="font-scripture text-xl font-bold text-slate-900">
                  {bilingual("Bạn Chưa Tham Gia Kế Hoạch Đọc Nào", "You Have Not Joined Any Reading Plan Yet")}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {bilingual(
                    "Hãy chọn một kế hoạch đọc Kinh Thánh để bắt đầu thói quen nuôi dưỡng tâm linh mỗi sáng.",
                    "Choose a Bible reading plan to build a daily devotional habit."
                  )}
                </p>
                <TactileButton
                  variant="gold"
                  size="md"
                  onClick={() => setActiveTab("plans")}
                >
                  <Compass className="w-4 h-4 mr-1.5" />
                  <span>{bilingual("Khám Phá Kế Hoạch Đọc", "Explore Reading Plans")}</span>
                </TactileButton>
              </div>
            )}
          </div>

          {/* Right Column: SOAP Devotional Journal Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-800" />
                <div>
                  <h3 className="font-scripture text-base font-bold text-slate-900">
                    {bilingual("Nhật Ký Tĩnh Nguyện (SOAP Method)", "Devotional Journal (SOAP Method)")}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-serif">
                    {bilingual("Ghi lại điều Chúa dạy bạn trong thì giờ tĩnh nguyện", "Record what God is speaking to your heart")}
                  </p>
                </div>
              </div>
              {journalSavedSuccess && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">
                  {bilingual("✓ Đã lưu sổ", "✓ Journal Saved")}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {bilingual("Tiêu Đề Bài Tĩnh Nguyện *", "Devotional Title *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bilingual("Ví dụ: Lòng Trông Cậy Nơi Chúa Sáng Nay", "e.g., Trusting in the Lord This Morning")}
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-900 mb-1">
                  {bilingual("S - SCRIPTURE (Câu Kinh Thánh Chúa phán cùng bạn) *", "S - SCRIPTURE (The Word speaking to you) *")}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={bilingual("Chép lại câu Kinh Thánh đánh động lòng bạn nhất hôm nay...", "Write down the scripture that touched your heart today...")}
                  value={soapScripture}
                  onChange={(e) => setSoapScripture(e.target.value)}
                  className="w-full p-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-indigo-950 mb-1">
                  {bilingual("O - OBSERVATION (Điều bạn nhận biết về Chúa)", "O - OBSERVATION (What do you observe about God?)")}
                </label>
                <textarea
                  rows={2}
                  placeholder={bilingual("Bạn quan sát thấy bản tính gì của Chúa, hay gương mẫu nào cần noi theo...", "Observations on God's character, truth, or example to follow...")}
                  value={soapObservation}
                  onChange={(e) => setSoapObservation(e.target.value)}
                  className="w-full p-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-900 mb-1">
                  {bilingual("A - APPLICATION (Áp dụng vào đời sống hôm nay)", "A - APPLICATION (How does this apply to your life today?)")}
                </label>
                <textarea
                  rows={2}
                  placeholder={bilingual("Một hành động đức tin cụ thể bạn sẽ thực hiện hôm nay...", "A specific step of faith or obedience you will take today...")}
                  value={soapApplication}
                  onChange={(e) => setSoapApplication(e.target.value)}
                  className="w-full p-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-900 mb-1">
                  {bilingual("P - PRAYER (Lời cầu nguyện đáp ứng) *", "P - PRAYER (Your response in prayer) *")}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={bilingual("Lời tâm sự chân thành dâng lên Cha Thiên Thượng...", "Your heartfelt prayer to Heavenly Father...")}
                  value={soapPrayer}
                  onChange={(e) => setSoapPrayer(e.target.value)}
                  className="w-full p-3 bg-[#FCFBF8] border border-amber-200/80 rounded-xl text-xs text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <TactileButton
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={savingJournal}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>{savingJournal ? bilingual("Đang Lưu Sổ...", "Saving...") : bilingual("Lưu Bài Tĩnh Nguyện Hôm Nay", "Save Devotional Journal")}</span>
                </TactileButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: EXPLORE PLANS */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-amber-800 font-serif">†</span>
                <span>{bilingual("Các Lộ Trình Đọc Kinh Thánh Chuẩn", "Bible Reading Pathways")}</span>
              </h2>
              <p className="text-xs text-slate-500 font-serif mt-0.5">
                {bilingual("Được thiết kế khoa học giúp tín hữu xây dựng thói quen tâm linh bền bỉ", "Systematic reading plans to build lasting spiritual habits")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isSubscribed = subscriptions.some((s) => s.planId === plan.id);
              const catObj = CATEGORY_NAMES[plan.category];
              const catLabel = catObj ? (isEn ? catObj.en : catObj.vi) : plan.category;

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl border border-amber-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    {plan.thumbnailUrl ? (
                      <img
                        src={plan.thumbnailUrl}
                        alt={plan.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-950 flex items-center justify-center text-amber-300 font-serif text-5xl">
                        †
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/90 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
                        {catLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-scripture text-lg font-bold text-slate-900 leading-snug">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif">
                        {plan.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{plan.durationDays} {bilingual("Ngày", "Days")}</span>
                      </span>

                      {isSubscribed ? (
                        <button
                          type="button"
                          onClick={() => {
                            const sub = subscriptions.find((s) => s.planId === plan.id);
                            if (sub) setActiveSub(sub);
                            setActiveTab("today");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 text-xs font-semibold hover:bg-amber-200 cursor-pointer"
                        >
                          {bilingual("Đang Đọc →", "Active Plan →")}
                        </button>
                      ) : (
                        <TactileButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleSubscribePlan(plan.id)}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          <span>{bilingual("Tham Gia Kế Hoạch", "Join Plan")}</span>
                        </TactileButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DEVOTIONAL JOURNALS */}
      {activeTab === "journals" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-scripture text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-amber-800 font-serif">†</span>
                <span>{bilingual("Sổ Tay Nhật Ký Tĩnh Nguyện Cá Nhân", "Personal Devotional SOAP Journal")}</span>
              </h2>
              <p className="text-xs text-slate-500 font-serif mt-0.5">
                {bilingual(
                  "Lưu giữ những khoảnh khắc Chúa Thánh Linh phán cùng lòng bạn mỗi sớm mai",
                  "Preserving sacred moments where the Holy Spirit speaks to your soul"
                )}
              </p>
            </div>
          </div>

          {loadingJournals ? (
            <div className="p-12 text-center text-xs text-slate-500 font-serif">
              {bilingual('"Đang mở sổ tay tĩnh nguyện..."', '"Opening devotional journal..."')}
            </div>
          ) : journals.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-amber-200/80 space-y-3">
              <PenTool className="w-10 h-10 mx-auto text-amber-700/60" />
              <h3 className="font-scripture text-lg font-bold text-slate-900">
                {bilingual("Chưa Có Bài Nhật Ký Nào Được Lưu", "No Devotional Entries Yet")}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {bilingual(
                  'Hãy chuyển sang tab "Phòng Tĩnh Nguyện Hôm Nay" để viết bài nhật ký SOAP đầu tiên của bạn.',
                  'Switch to "Today\'s Sanctuary Reading" tab to record your first SOAP journal.'
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journals.map((j) => (
                <div
                  key={j.id}
                  className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 font-serif bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        📖 {j.passage}
                      </span>
                      <span className="text-[11px] text-slate-400 font-serif">
                        {new Date(j.createdAt).toLocaleDateString(isEn ? "en-US" : "vi-VN")}
                      </span>
                    </div>

                    <h3 className="font-scripture text-lg font-bold text-slate-900 leading-snug">
                      {j.title}
                    </h3>

                    {/* SOAP Breakdown */}
                    <div className="space-y-2 text-xs text-slate-700 font-serif bg-[#FCFBF8] p-4 rounded-2xl border border-amber-100">
                      <div>
                        <span className="font-bold text-amber-900">{bilingual("S (Lời Chúa):", "S (Scripture):")}</span>{" "}
                        <span className="italic">"{j.rhemaWord}"</span>
                      </div>
                      {j.observation && (
                        <div>
                          <span className="font-bold text-indigo-950">{bilingual("O (Nhận biết):", "O (Observation):")}</span>{" "}
                          <span>{j.observation}</span>
                        </div>
                      )}
                      {j.application && (
                        <div>
                          <span className="font-bold text-emerald-900">{bilingual("A (Áp dụng):", "A (Application):")}</span>{" "}
                          <span>{j.application}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-rose-900">{bilingual("P (Cầu nguyện):", "P (Prayer):")}</span>{" "}
                        <span className="italic text-slate-600">"{j.prayer}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-amber-100">
                    <button
                      type="button"
                      onClick={() => handleDeleteJournal(j.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title={bilingual("Xóa bài viết", "Delete entry")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
