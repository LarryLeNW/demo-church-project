"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import {
  Flame,
  X,
  Sprout,
  Sun,
  Footprints,
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { useLanguage } from "@/lib/i18n/language-context";

export interface SpiritualMilestone {
  id: string;
  title: string;
  englishTitle: string;
  requiredDays: number;
  scripture: string;
  scriptureRef: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface DevotionalStreakData {
  id?: string;
  userId?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
  unlockedMilestones: string[];
  allMilestones: SpiritualMilestone[];
}

interface DevotionalStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreakUpdated?: () => void;
}

export function DevotionalStreakModal({
  isOpen,
  onClose,
  onStreakUpdated,
}: DevotionalStreakModalProps) {
  const { bilingual, isEn } = useLanguage();
  const [data, setData] = useState<DevotionalStreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStreak();
    }
  }, [isOpen]);

  async function loadStreak() {
    try {
      setLoading(true);
      const res = await apiFetch<DevotionalStreakData>("/bible/streaks/my-streak");
      setData(res);
    } catch (err) {
      console.error("Lỗi tải chuỗi ngày tĩnh nguyện:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecordToday() {
    try {
      setRecording(true);
      await apiFetch("/bible/streaks/record", { method: "POST" });
      await loadStreak();
      onStreakUpdated?.();
    } catch (err) {
      console.error("Lỗi ghi nhận tĩnh nguyện:", err);
    } finally {
      setRecording(false);
    }
  }

  if (!isOpen) return null;

  const milestoneIcons: Record<string, React.ReactNode> = {
    beginner_3d: <Flame className="w-5 h-5 text-amber-500" />,
    planted_by_water_7d: <Sprout className="w-5 h-5 text-emerald-600" />,
    lamp_to_feet_14d: <Sun className="w-5 h-5 text-amber-600" />,
    walking_with_christ_30d: <Footprints className="w-5 h-5 text-indigo-600" />,
    pillar_in_temple_100d: <Crown className="w-5 h-5 text-amber-600" />,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FCFBF8] border border-amber-300/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-600">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-scripture text-lg font-bold text-slate-900 leading-tight">
                {bilingual(
                  "Thói Quen Tĩnh Nguyện & Cột Mốc Đức Tin",
                  "Devotional Habits & Faith Milestones"
                )}
              </h3>
              <p className="text-[11px] font-serif text-amber-800">
                {bilingual(
                  '"Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi." — Thi Thiên 119:105',
                  '"Your word is a lamp for my feet, a light on my path." — Psalm 119:105'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Streak Hero */}
        <div className="bg-gradient-to-r from-amber-950 via-indigo-950 to-indigo-900 rounded-2xl p-5 text-white border border-amber-400/40 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex flex-col items-center justify-center">
              <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-bounce" />
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                Streak
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-scripture font-bold text-amber-300">
                  {loading ? "..." : data?.currentStreak ?? 0}
                </span>
                <span className="text-sm font-serif text-slate-200">
                  {bilingual("Ngày Liên Tục", "Days Streak")}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {bilingual("Kỷ lục bền đỗ: ", "Longest streak: ")}
                <strong className="text-amber-200">
                  {data?.longestStreak ?? 0} {bilingual("ngày", "days")}
                </strong>
              </p>
            </div>
          </div>

          <div>
            {data?.isActiveToday ? (
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{bilingual("Hôm nay đã tĩnh nguyện", "Devotions completed today")}</span>
              </div>
            ) : (
              <TactileButton
                variant="gold"
                size="sm"
                onClick={handleRecordToday}
                disabled={recording}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>
                  {recording
                    ? bilingual("Đang Ghi...", "Recording...")
                    : bilingual("Ghi Nhận Hôm Nay", "Record Today's Devotion")}
                </span>
              </TactileButton>
            )}
          </div>
        </div>

        {/* Spiritual Milestones List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold font-serif text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>†</span>
              <span>
                {bilingual(
                  "Các Cột Mốc Thuộc Linh Đã Khải Thị",
                  "Revealed Spiritual Milestones"
                )}
              </span>
            </h4>
            <span className="text-[11px] text-slate-500">
              {data?.unlockedMilestones.length || 0} / {data?.allMilestones.length || 5}{" "}
              {bilingual("Cột Mốc", "Milestones")}
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {data?.allMilestones.map((m) => {
              const isUnlocked = m.isUnlocked;
              const progress = Math.min(
                100,
                Math.round(((data?.currentStreak || 0) / m.requiredDays) * 100),
              );

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUnlocked
                      ? "bg-amber-50/60 border-amber-300/80 shadow-xs"
                      : "bg-[#FAFAF9] border-slate-200/80 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isUnlocked
                            ? "bg-white border-amber-300 shadow-xs"
                            : "bg-slate-100 border-slate-200 text-slate-400"
                        }`}
                      >
                        {milestoneIcons[m.id] || <Flame className="w-5 h-5 text-amber-500" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-slate-900">
                            {isEn ? (m.englishTitle || m.title) : m.title}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-serif">
                            ({isEn ? m.title : m.englishTitle})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{m.description}</p>
                        <p className="text-[10px] font-serif italic text-amber-900 mt-1">
                          "{m.scripture}" — <strong>{m.scriptureRef}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-amber-700" />
                          <span>{bilingual("Đã Đạt", "Unlocked")}</span>
                        </span>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>
                              {m.requiredDays} {bilingual("ngày", "days")}
                            </span>
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {data?.currentStreak || 0} / {m.requiredDays} {bilingual("ngày", "days")} ({progress}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-amber-200/70 pt-4">
          <span className="text-[11px] font-serif italic text-slate-500">
            {bilingual(
              "Mỗi ngày tương giao cùng Chúa là một bước tiến trên linh trình.",
              "Walking daily with the Lord strengthens every step of your faith journey."
            )}
          </span>
          <TactileButton variant="secondary" size="sm" onClick={onClose}>
            <span>{bilingual("Tạ Ơn Chúa & Đóng", "Amen & Close")}</span>
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
