"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { BookOpen } from "lucide-react";

export default function AdminCourseDetailPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Chi Tiết Khóa Học & Bài Học Video"
      titleEn="Course Content & Video Lessons"
      descriptionVi="Trình biên tập chi tiết bài giảng, danh sách video, câu hỏi thảo luận và tài liệu PDF bồi linh cho từng khóa học."
      descriptionEn="Editor for course curriculum, video lesson attachments, discussion prompts, and study guide handouts."
      icon={BookOpen}
    />
  );
}
