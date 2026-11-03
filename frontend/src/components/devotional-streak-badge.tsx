"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { Flame } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  DevotionalStreakModal,
  type DevotionalStreakData,
} from "./devotional-streak-modal";

interface DevotionalStreakBadgeProps {
  className?: string;
  showText?: boolean;
}

export function DevotionalStreakBadge({
  className = "",
  showText = true,
}: DevotionalStreakBadgeProps) {
  const { bilingual } = useLanguage();
  const [data, setData] = useState<DevotionalStreakData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadStreak();
  }, []);

  async function loadStreak() {
    try {
      const res = await apiFetch<DevotionalStreakData>("/bible/streaks/my-streak");
      setData(res);
    } catch {
      // Ignored if user not authenticated or on error
    }
  }

  const streak = data?.currentStreak ?? 0;
  const isActive = data?.isActiveToday;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title={bilingual(
          "Xem chuỗi ngày tĩnh nguyện và cột mốc thuộc linh",
          "View devotional streak & spiritual milestones"
        )}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
          isActive
            ? "bg-amber-500/10 border-amber-400 text-amber-900 hover:bg-amber-500/20 shadow-xs"
            : streak > 0
            ? "bg-amber-50/70 border-amber-300 text-amber-800 hover:bg-amber-100/60"
            : "bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50"
        } ${className}`}
      >
        <Flame
          className={`w-4 h-4 ${
            streak > 0
              ? "text-amber-600 fill-amber-500 animate-pulse"
              : "text-slate-400"
          }`}
        />
        <span>{streak}</span>
        {showText && (
          <span className="font-serif font-normal text-[11px]">
            {bilingual("ngày", "days")}
          </span>
        )}
      </button>

      <DevotionalStreakModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStreakUpdated={loadStreak}
      />
    </>
  );
}
