"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  Wrench,
  Sparkles,
  ArrowLeft,
  Globe,
  LucideIcon,
  Layers,
} from "lucide-react";

interface AdminDevPlaceholderProps {
  titleVi: string;
  titleEn: string;
  descriptionVi?: string;
  descriptionEn?: string;
  icon?: LucideIcon;
}

export function AdminDevPlaceholder({
  titleVi,
  titleEn,
  descriptionVi = "Tính năng quản trị này đang được phát triển và hoàn thiện để phục vụ công tác điều hành mục vụ.",
  descriptionEn = "This administrative module is currently under active development and will be available soon.",
  icon: Icon = Layers,
}: AdminDevPlaceholderProps) {
  const { isEn, bilingual } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10 px-4 animate-fade-in">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-amber-200/90 shadow-md p-8 sm:p-10 text-center space-y-6">
        {/* Top Icon Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex items-center justify-center text-primary-700 animate-holy-breathe">
            <Icon className="w-8 h-8" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80 text-xs font-semibold">
          <Wrench className="w-3.5 h-3.5 text-primary-700 animate-spin" style={{ animationDuration: "8s" }} />
          <span>{isEn ? "Module Under Development" : "Module Đang Phát Triển"}</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2.5">
          <h1 className="font-scripture text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isEn ? titleEn : titleVi}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
            {isEn ? descriptionEn : descriptionVi}
          </p>
        </div>

        {/* Sacred Notice Box */}
        <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-amber-200/70 text-xs text-slate-600 space-y-1 font-serif">
          <div className="flex items-center justify-center gap-1.5 text-primary-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soli Deo Gloria</span>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            {bilingual(
              "Giao diện và cơ sở dữ liệu đang được đồng bộ hóa để phục vụ Hội Thánh chu toàn nhất.",
              "Interface and database schemas are being synchronized for church administration."
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <TactileButton variant="primary" size="md" className="w-full justify-center">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>{isEn ? "Back to Dashboard" : "Về Bảng Điều Khiển"}</span>
            </TactileButton>
          </Link>
          <Link href="/" target="_blank" className="w-full sm:w-auto">
            <TactileButton variant="secondary" size="md" className="w-full justify-center">
              <Globe className="w-4 h-4 mr-1.5" />
              <span>{isEn ? "Live Website" : "Xem Trang Chủ"}</span>
            </TactileButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
