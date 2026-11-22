"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { Video } from "lucide-react";

export default function AdminSermonsPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Kho Bài Giảng & Video Mục Vụ"
      titleEn="Sermon Vault & Media Management"
      descriptionVi="Quản trị kho lưu trữ video bài giảng Chúa Nhật, ghi chú dàn ý tương tác và tư liệu truyền thông của Hội Thánh."
      descriptionEn="Management console for Sunday sermon video archives, interactive outline notes, and church media assets."
      icon={Video}
    />
  );
}
