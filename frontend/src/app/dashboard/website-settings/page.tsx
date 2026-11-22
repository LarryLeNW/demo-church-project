"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { Globe } from "lucide-react";

export default function AdminWebsiteSettingsPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Cấu Hình Nội Dung Trang Chủ (CMS)"
      titleEn="Homepage & Website Content CMS"
      descriptionVi="Hệ thống tùy biến nội dung công khai ngoài website (saministry.org): Banner chính, khẩu hiệu Lời Chúa, khóa học nổi bật và thông tin liên hệ."
      descriptionEn="Content management system for public pages (saministry.org): Hero banners, scripture mottos, featured courses, and contact information."
      icon={Globe}
    />
  );
}
