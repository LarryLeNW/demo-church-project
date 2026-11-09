import React from "react";
import { cn } from "@/lib/cn";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  badge?: React.ReactNode;
  title?: string;
  subtitle?: string;
  isInteractive?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  badge,
  title,
  subtitle,
  isInteractive = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative p-6 bg-white rounded-2xl border border-amber-200/80 shadow-md shadow-amber-950/5 transition-all duration-200",
        isInteractive &&
          "hover:border-[#F17F34] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F17F34]/10 cursor-pointer",
        className,
      )}
      {...props}
    >
      {(badge || title) && (
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-amber-100/80">
          <div>
            {title && (
              <h3 className="font-scripture text-lg font-bold text-slate-900 tracking-tight leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs font-medium text-slate-500 mt-0.5 tracking-normal">
                {subtitle}
              </p>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
