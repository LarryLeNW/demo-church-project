"use client";

import React from "react";
import { AdminDevPlaceholder } from "@/components/admin/admin-dev-placeholder";
import { DollarSign } from "lucide-react";

export default function AdminGivingPage() {
  return (
    <AdminDevPlaceholder
      titleVi="Dâng Hiến & Báo Cáo Thuế 501(c)(3)"
      titleEn="Giving & US 501(c)(3) Tax Statements"
      descriptionVi="Theo dõi các giao dịch dâng hiến trực tuyến qua Stripe/ACH, quản lý quỹ mục vụ và tự động xuất biên nhận thuế IRS cuối năm."
      descriptionEn="Monitor Stripe/ACH giving transactions, manage ministry funds, and generate automated IRS year-end tax deduction statements."
      icon={DollarSign}
    />
  );
}
