"use client";

import React from "react";
import Image from "next/image";

interface FixedWorldMapBackgroundProps {
  variant?: "default" | "vivid" | "clear";
  className?: string;
}

export function FixedWorldMapBackground({
  variant = "default",
  className = "",
}: FixedWorldMapBackgroundProps) {
  const isVivid = variant === "vivid" || variant === "clear";

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#002244] ${className}`}>
      <Image
        src="/world-map-bg.png"
        alt="World Map Background"
        fill
        sizes="100vw"
        className={`object-cover object-top transition-opacity duration-700 ${
          isVivid
            ? "opacity-95 mix-blend-screen"
            : "opacity-60 mix-blend-screen"
        }`}
        priority
      />
      {/* Lớp hòa sắc xanh Hoàng Gia uy nghi: variant 'vivid' cho nền sáng rõ bản đồ thế giới hơn */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isVivid
            ? "bg-gradient-to-b from-[#002a50]/45 via-[#003566]/40 to-[#001428]/65"
            : "bg-gradient-to-b from-[#003366]/85 via-[#004780]/80 to-[#001c3d]/95"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isVivid
            ? "bg-radial-[circle_at_center] from-transparent via-black/10 to-black/30"
            : "bg-radial-[circle_at_center] from-transparent via-black/10 to-black/40"
        }`}
      />
    </div>
  );
}
