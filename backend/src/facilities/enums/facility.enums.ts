export enum FacilityType {
  SANCTUARY = 'sanctuary',
  FELLOWSHIP_HALL = 'fellowship_hall',
  CHAPEL = 'chapel',
  CLASSROOM = 'classroom',
  YOUTH_CENTER = 'youth_center',
  CONFERENCE_ROOM = 'conference_room',
  PASTOR_OFFICE = 'pastor_office',
  NURSERY = 'nursery',
}

export enum ReservationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum EquipmentType {
  AUDIO_SOUND = 'audio_sound',
  VIDEO_LIVESTREAM = 'video_livestream',
  MUSICAL_INSTRUMENT = 'musical_instrument',
  FURNITURE = 'furniture',
  COMMUNION_HOLY_BAPTISM = 'communion_holy_baptism',
}

export enum EquipmentCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  MAINTENANCE_REQUIRED = 'maintenance_required',
}

export const FACILITY_TYPE_META: Record<
  FacilityType,
  { labelVi: string; labelEn: string; icon: string; defaultCapacity: number }
> = {
  [FacilityType.SANCTUARY]: {
    labelVi: 'Thánh Đường Chính',
    labelEn: 'Main Sanctuary',
    icon: 'Church',
    defaultCapacity: 450,
  },
  [FacilityType.FELLOWSHIP_HALL]: {
    labelVi: 'Nhà Thông Công & Ẩm Thực',
    labelEn: 'Fellowship Hall & Banquet',
    icon: 'Utensils',
    defaultCapacity: 150,
  },
  [FacilityType.CHAPEL]: {
    labelVi: 'Nhà Nguyện Tĩnh Nguyện',
    labelEn: 'Prayer Chapel',
    icon: 'Flame',
    defaultCapacity: 50,
  },
  [FacilityType.CLASSROOM]: {
    labelVi: 'Phòng Học Trường Chúa Nhật',
    labelEn: 'Sunday School Classroom',
    icon: 'BookOpen',
    defaultCapacity: 25,
  },
  [FacilityType.YOUTH_CENTER]: {
    labelVi: 'Phòng Sinh Hoạt Thanh Thiếu Niên',
    labelEn: 'Youth & Student Lounge',
    icon: 'Sparkles',
    defaultCapacity: 80,
  },
  [FacilityType.CONFERENCE_ROOM]: {
    labelVi: 'Phòng Họp Ban Trị Sự',
    labelEn: 'Board & Conference Room',
    icon: 'Users',
    defaultCapacity: 20,
  },
  [FacilityType.PASTOR_OFFICE]: {
    labelVi: 'Văn Phòng Tư Vấn Mục Vụ',
    labelEn: "Pastor's Counseling Study",
    icon: 'HeartHandshake',
    defaultCapacity: 6,
  },
  [FacilityType.NURSERY]: {
    labelVi: 'Phòng Hài Nhi & Chăm Sóc Mẹ Bé',
    labelEn: "Nursery & Mother's Room",
    icon: 'Baby',
    defaultCapacity: 15,
  },
};
