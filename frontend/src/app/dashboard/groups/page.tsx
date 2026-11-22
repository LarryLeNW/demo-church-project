"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { Users2 } from "lucide-react";

export default function AdminGroupsPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Quản Lý Nhóm Nhỏ (Life Groups)"
      titleEn="Small Groups / Life Groups Management"
      descriptionVi="Hệ thống điều phối các nhóm tế bào, phân công trưởng nhóm, tài liệu thảo luận Kinh Thánh và theo dõi điểm danh hàng tuần."
      descriptionEn="Coordination of cell groups, leader assignments, Bible discussion questions, and weekly attendance tracking."
      icon={Users2}
    />
  );
}
