import React from "react";
import { cn } from "@/lib/cn";

interface TactileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "default" | "glass" | "dark";
}

export const TactileInput: React.FC<TactileInputProps> = ({
  label,
  error,
  hint,
  variant = "default",
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const isGlass = variant === "glass" || variant === "dark";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-xs font-semibold tracking-wide flex items-center justify-between",
            isGlass ? "text-slate-200" : "text-slate-800"
          )}
        >
          <span>{label}</span>
          {hint && (
            <span className={cn("text-xs font-normal", isGlass ? "text-slate-400" : "text-slate-500")}>
              {hint}
            </span>
          )}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-4 py-3 min-h-[48px] text-base sm:text-sm rounded-xl transition-all duration-200 shadow-xs",
          isGlass
            ? "bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:bg-white/15"
            : "bg-white text-slate-900 border border-amber-200/90 placeholder:text-slate-500 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-400/20",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs font-medium text-rose-400 mt-0.5">{error}</span>}
    </div>
  );
};
