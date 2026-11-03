import React from "react";
import { cn } from "@/lib/cn";

export type ReverentButtonVariant = "primary" | "gold" | "olive" | "secondary" | "crimson";

interface ReverentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ReverentButtonVariant;
  size?: "sm" | "md" | "lg";
  withCross?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ReverentButtonVariant, string> = {
  primary:
    "bg-indigo-950 text-white hover:bg-indigo-900 border border-amber-400/30 shadow-md shadow-indigo-950/20",
  gold:
    "bg-amber-700 text-white hover:bg-amber-800 border border-amber-300/60 shadow-md shadow-amber-950/15",
  olive:
    "bg-emerald-800 text-white hover:bg-emerald-700 border border-emerald-400/40 shadow-md shadow-emerald-950/15",
  secondary:
    "bg-white text-slate-900 hover:bg-[#F8F5EE] border border-amber-200/90 shadow-sm",
  crimson:
    "bg-rose-900 text-white hover:bg-rose-800 border border-rose-400/30 shadow-md shadow-rose-950/20",
};

const sizeStyles = {
  sm: "px-3.5 py-2 text-xs min-h-[38px] rounded-lg tracking-wide",
  md: "px-5 py-2.5 text-sm min-h-[46px] rounded-xl tracking-wide",
  lg: "px-7 py-3.5 text-base min-h-[52px] rounded-xl tracking-wide",
};

export const TactileButton: React.FC<ReverentButtonProps> = ({
  variant = "primary",
  size = "md",
  withCross = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer",
        "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {withCross && <span className="mr-2 text-amber-300/90 font-serif">†</span>}
      {children}
    </button>
  );
};
