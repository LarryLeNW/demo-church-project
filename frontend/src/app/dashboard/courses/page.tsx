"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { BookOpen } from "lucide-react";

export default function AdminCoursesPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Quản Lý Khóa Học & Đào Tạo"
      titleEn="Courses & Training Management"
      descriptionVi="Hệ thống quản lý toàn bộ khóa học môn đồ hóa, video bài giảng, tài liệu học tập và theo dõi tiến độ của học viên."
      descriptionEn="Comprehensive management of discipleship courses, sermon video lessons, study materials, and student progress tracking."
      icon={BookOpen}
    />
  );
}
