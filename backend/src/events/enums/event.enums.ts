export enum EventCategory {
  WORSHIP = 'worship',
  FELLOWSHIP = 'fellowship',
  CAMP_RETREAT = 'camp_retreat',
  TRAINING = 'training',
  OUTREACH = 'outreach',
  FAMILY_KIDS = 'family_kids',
}

export enum RegistrationStatus {
  CONFIRMED = 'confirmed',
  WAITLIST = 'waitlist',
  CANCELLED = 'cancelled',
}

export enum EventPaymentStatus {
  FREE = 'free',
  PAID = 'paid',
  PENDING = 'pending',
}

export const EVENT_CATEGORY_META: Record<
  EventCategory,
  { labelVi: string; labelEn: string; color: string }
> = {
  [EventCategory.WORSHIP]: {
    labelVi: 'Thờ Phượng & Bồi Linh',
    labelEn: 'Worship & Revival',
    color: 'indigo',
  },
  [EventCategory.FELLOWSHIP]: {
    labelVi: 'Thông Công & Ẩm Thực',
    labelEn: 'Fellowship & Banquets',
    color: 'emerald',
  },
  [EventCategory.CAMP_RETREAT]: {
    labelVi: 'Trại Hè & Khóa Bồi Dưỡng',
    labelEn: 'Camps & Retreats',
    color: 'amber',
  },
  [EventCategory.TRAINING]: {
    labelVi: 'Đào Tạo Môn Đồ & Chấp Sự',
    labelEn: 'Discipleship & Leadership',
    color: 'blue',
  },
  [EventCategory.OUTREACH]: {
    labelVi: 'Truyền Giáo & Cứu Trợ',
    labelEn: 'Community Outreach',
    color: 'purple',
  },
  [EventCategory.FAMILY_KIDS]: {
    labelVi: 'Gia Đình & Thiếu Nhi (VBS)',
    labelEn: 'Family & Children (VBS)',
    color: 'rose',
  },
};
