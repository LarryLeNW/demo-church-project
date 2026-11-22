import React from "react";
import { cn } from "@/lib/cn";

export interface CountryFlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * High-definition SVG Flag of Vietnam 🇻🇳
 * Scaled 3:2 ratio with mathematically precise 5-pointed gold star
 */
export function VietnamFlag({ className, ...props }: CountryFlagProps) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={cn(
        "w-5 h-3.5 rounded-[2px] shadow-2xs overflow-hidden shrink-0 border border-black/10 inline-block align-middle",
        className
      )}
      aria-label="Quốc kỳ Việt Nam"
      {...props}
    >
      <rect width="24" height="16" fill="#DA251D" />
      <polygon
        fill="#FFFF00"
        points="12.00,3.20 13.08,6.52 16.57,6.52 13.74,8.57 14.82,11.88 12.00,9.83 9.18,11.88 10.26,8.57 7.43,6.52 10.92,6.52"
      />
    </svg>
  );
}

/**
 * High-definition SVG Flag of the United States 🇺🇸
 * Scaled 3:2 ratio with 13 stripes and star constellation
 */
export function USAFlag({ className, ...props }: CountryFlagProps) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={cn(
        "w-5 h-3.5 rounded-[2px] shadow-2xs overflow-hidden shrink-0 border border-black/10 inline-block align-middle",
        className
      )}
      aria-label="Flag of the United States"
      {...props}
    >
      {/* 13 Stripes: red base + 6 white stripes */}
      <rect width="24" height="16" fill="#B22234" />
      <rect y="1.23" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="3.69" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="6.15" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="8.62" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="11.08" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="13.54" width="24" height="1.23" fill="#FFFFFF" />
      {/* Blue Canton */}
      <rect width="9.6" height="8.62" fill="#3C3B6E" />
      {/* Crisp White Stars Grid */}
      <circle cx="2.4" cy="1.44" r="0.55" fill="#FFFFFF" />
      <circle cx="4.8" cy="1.44" r="0.55" fill="#FFFFFF" />
      <circle cx="7.2" cy="1.44" r="0.55" fill="#FFFFFF" />
      <circle cx="3.2" cy="2.87" r="0.55" fill="#FFFFFF" />
      <circle cx="6.4" cy="2.87" r="0.55" fill="#FFFFFF" />
      <circle cx="2.4" cy="4.31" r="0.55" fill="#FFFFFF" />
      <circle cx="4.8" cy="4.31" r="0.55" fill="#FFFFFF" />
      <circle cx="7.2" cy="4.31" r="0.55" fill="#FFFFFF" />
      <circle cx="3.2" cy="5.74" r="0.55" fill="#FFFFFF" />
      <circle cx="6.4" cy="5.74" r="0.55" fill="#FFFFFF" />
      <circle cx="2.4" cy="7.18" r="0.55" fill="#FFFFFF" />
      <circle cx="4.8" cy="7.18" r="0.55" fill="#FFFFFF" />
      <circle cx="7.2" cy="7.18" r="0.55" fill="#FFFFFF" />
    </svg>
  );
}

export function CountryFlag({
  country,
  className,
}: {
  country: "VI" | "EN" | "VN" | "US";
  className?: string;
}) {
  if (country === "VI" || country === "VN") {
    return <VietnamFlag className={className} />;
  }
  return <USAFlag className={className} />;
}
