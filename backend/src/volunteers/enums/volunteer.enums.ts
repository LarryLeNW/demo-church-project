export enum VolunteerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval',
}

export enum BackgroundCheckStatus {
  NOT_REQUIRED = 'not_required',
  PENDING = 'pending',
  APPROVED = 'approved',
  EXPIRED = 'expired',
}

export enum RosterStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  SWAPPED = 'swapped',
}

export interface MinistryRoleTemplate {
  nameVi: string;
  nameEn: string;
}

export const MINISTRY_DEFAULT_ROLES: Record<string, MinistryRoleTemplate[]> = {
  worship: [
    { nameVi: 'Trưởng Ban Thờ Phượng (Worship Leader)', nameEn: 'Worship Leader' },
    { nameVi: 'Hát Chính (Lead Vocal)', nameEn: 'Lead Vocalist' },
    { nameVi: 'Hát Bè (Backing Vocal)', nameEn: 'Backing Vocalist' },
    { nameVi: 'Đệm Đàn Piano / Keyboard', nameEn: 'Pianist / Keyboardist' },
    { nameVi: 'Đàn Guitar Acoustic / Electric', nameEn: 'Guitarist' },
    { nameVi: 'Đánh Trống (Drums)', nameEn: 'Drummer' },
    { nameVi: 'Đàn Bass', nameEn: 'Bassist' },
  ],
  media: [
    { nameVi: 'Kỹ Thuật Mixer Âm Thanh (Sound Engineer)', nameEn: 'Sound Engineer' },
    { nameVi: 'Trình Chiếu Bài Hát (ProPresenter / Lyrics)', nameEn: 'ProPresenter Operator' },
    { nameVi: 'Kỹ Thuật Máy Quay & Livestream', nameEn: 'Camera & Livestream Operator' },
    { nameVi: 'Nhiếp Ảnh & Truyền Thông Sự Kiện', nameEn: 'Event Photographer' },
  ],
  ushers: [
    { nameVi: 'Trưởng Ban Tiếp Tân (Head Usher)', nameEn: 'Head Usher' },
    { nameVi: 'Đón Tiếp Cửa Chính (Door Greeter)', nameEn: 'Door Greeter' },
    { nameVi: 'Hướng Dẫn Chỗ Ngồi (Usher)', nameEn: 'Seating Usher' },
    { nameVi: 'Thu Tiền Dâng Hiến (Offering Collector)', nameEn: 'Offering Collector' },
    { nameVi: 'Bàn Thông Tin & Quà Tặng Thân Hữu', nameEn: 'Welcome Desk Host' },
  ],
  children: [
    { nameVi: 'Giáo Viên Lớp Nhà Trẻ (Nursery: 0-2 tuổi)', nameEn: 'Nursery Teacher' },
    { nameVi: 'Giáo Viên Lớp Mẫu Giáo (Preschool: 3-5 tuổi)', nameEn: 'Preschool Teacher' },
    { nameVi: 'Giáo Viên Lớp Thiếu Nhi (Elementary: 6-11 tuổi)', nameEn: 'Elementary Teacher' },
    { nameVi: 'Trợ Giảng & Điều Phối Check-in', nameEn: 'Check-in Assistant' },
  ],
  hospitality: [
    { nameVi: 'Chuẩn Bị Bàn Cà Phê & Điểm Tâm Sáng', nameEn: 'Coffee & Breakfast Host' },
    { nameVi: 'Phục Vụ Bữa Ăn Thông Công Sau Giờ Nhóm', nameEn: 'Fellowship Meal Server' },
    { nameVi: 'Hậu Cần & Dọn Dẹp Nhà Bếp', nameEn: 'Kitchen Logistics & Cleanup' },
  ],
};
