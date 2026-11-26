"use client";

import React from "react";
import Image from "next/image";

export function FixedWorldMapBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#002f5a]">
      <Image
        src="/world-map-bg.png"
        alt="World Map Background"
        fill
        sizes="100vw"
        className="object-cover object-top opacity-60 mix-blend-screen"
        priority
      />
      {/* Lớp hòa sắc xanh Hoàng Gia uy nghi (Royal Blue #003865 -> #002244) bảo đảm độ tương phản chữ hoàn hảo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/85 via-[#004780]/80 to-[#001c3d]/95" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-black/10 to-black/40" />
    </div>
  );
}
