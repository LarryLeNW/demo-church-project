"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { LineChart } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Báo Cáo Sức Khỏe & Thống Kê Mục Vụ"
      titleEn="Ministry Analytics & Health Cockpit"
      descriptionVi="Bảng tổng hợp chỉ số phát triển Hội Thánh: Môn đồ hóa, tương tác bài giảng, điểm danh nhóm nhỏ và phân tích dòng tiền dâng hiến."
      descriptionEn="Executive dashboard monitoring church spiritual health: Discipleship progression, sermon engagement, attendance, and giving trends."
      icon={LineChart}
    />
  );
}
