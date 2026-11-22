"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { HeartHandshake } from "lucide-react";

export default function AdminPrayersPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Duyệt Yêu Cầu Cầu Thay & Chăm Sóc"
      titleEn="Prayer Requests & Pastoral Care"
      descriptionVi="Tiếp nhận, kiểm duyệt các lời cầu nguyện gửi từ trang chủ website và phân công nhân sự thăm viếng, đồng hành tâm linh."
      descriptionEn="Review and moderate community prayer requests from the public site, assigning pastoral care teams for visitation."
      icon={HeartHandshake}
    />
  );
}
