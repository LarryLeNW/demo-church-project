import React from "react";
import { cn } from "@/lib/cn";

interface TactileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TactileInput: React.FC<TactileInputProps> = ({
  label,
  error,
  hint,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-800 tracking-wide flex items-center justify-between"
        >
          <span>{label}</span>
          {hint && <span className="text-[11px] text-slate-400 font-normal">{hint}</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-4 py-3 min-h-[48px] text-base sm:text-sm bg-white text-slate-900 rounded-xl",
          "border border-amber-200/90 shadow-xs",
          "placeholder:text-slate-400",
          "focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
          "transition-all duration-200",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-400/20",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs font-medium text-rose-600 mt-0.5">{error}</span>}
    </div>
  );
};
