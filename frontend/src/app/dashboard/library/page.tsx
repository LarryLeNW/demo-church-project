"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { Library } from "lucide-react";

export default function AdminLibraryPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Quản Lý Thư Viện & Sách Bồi Linh"
      titleEn="Spiritual Library & Books Management"
      descriptionVi="Trung tâm quản lý sách PDF, giáo trình thần học, tài liệu bồi linh và kiểm soát hiển thị trên thư viện trang chủ."
      descriptionEn="Central repository for spiritual PDF books, theological study guides, and visibility controls on the public library portal."
      icon={Library}
    />
  );
}
