"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { UserCheck } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Quản Lý Người Dùng & Phân Quyền"
      titleEn="User Accounts & Role Permissions"
      descriptionVi="Quản trị danh sách tín hữu, môn đồ và ban lãnh đạo. Cấu hình phân quyền vai trò RBAC (Admin, Leader, Member) và bảo mật tài khoản."
      descriptionEn="Administration of disciples, church members, and leaders. Configure RBAC role permissions (Admin, Leader, Member) and account security."
      icon={UserCheck}
    />
  );
}
