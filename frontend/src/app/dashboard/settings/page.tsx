"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Cài Đặt Hệ Thống & Bảo Mật"
      titleEn="System Settings & Security Configuration"
      descriptionVi="Cấu hình tích hợp kỹ thuật nền tảng: Cổng thanh toán Stripe, dịch vụ gửi email Resend, sao lưu dữ liệu và chính sách bảo mật hệ thống."
      descriptionEn="Global system setup: Stripe payment gateway, Resend email service, database backups, and security governance."
      icon={Settings}
    />
  );
}
