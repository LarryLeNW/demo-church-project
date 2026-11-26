"use client";

import React from "react";
import Image from "next/image";

export function FixedWorldMapBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#004b87]">
      <Image
        src="/world-map-bg.png"
        alt="World Map Background"
        fill
        sizes="100vw"
        className="object-cover object-top opacity-85"
        priority
      />
      {/* Lớp hòa sắc xanh Hoàng Gia (Royal Blue #0059A3) chuẩn Prescott Potter's House */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200/35 via-[#0059a3]/60 to-[#002f5a]/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-white/10 via-transparent to-black/30" />
    </div>
  );
}
