export enum CareType {
  HOSPITAL_VISIT = 'hospital_visit',
  HOME_VISIT = 'home_visit',
  ANOINTING_PRAYER = 'anointing_prayer',
  COUNSELING = 'counseling',
  BABY_DEDICATION = 'baby_dedication',
  BEREAVEMENT = 'bereavement',
}

export enum CareUrgency {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

export enum CareStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const CARE_TYPE_META: Record<
  CareType,
  { labelVi: string; labelEn: string; icon: string; description: string }
> = {
  [CareType.HOSPITAL_VISIT]: {
    labelVi: 'Thăm Viếng Bệnh Viện',
    labelEn: 'Hospital Care Visit',
    icon: 'Building2',
    description: 'Mục sư đến thăm, an ủi và cầu nguyện tại giường bệnh.',
  },
  [CareType.HOME_VISIT]: {
    labelVi: 'Thăm Viếng Tư Gia',
    labelEn: 'Home Pastoral Visit',
    icon: 'Home',
    description: 'Thăm viếng gia đình, thông công và cầu nguyện chúc phước nơi ở.',
  },
  [CareType.ANOINTING_PRAYER]: {
    labelVi: 'Cầu Nguyện Xức Dầu (Gia-cơ 5:14)',
    labelEn: 'Anointing with Oil Prayer',
    icon: 'Flame',
    description: 'Các trưởng lão Hội Thánh xức dầu nhân danh Chúa và cầu nguyện chữa lành.',
  },
  [CareType.COUNSELING]: {
    labelVi: 'Tư Vấn Thuộc Linh & Hôn Nhân',
    labelEn: 'Spiritual & Marriage Counseling',
    icon: 'HeartHandshake',
    description: 'Trò chuyện riêng tư cùng Mục sư tháo gỡ nan đề cuộc sống và hôn nhân.',
  },
  [CareType.BABY_DEDICATION]: {
    labelVi: 'Lễ Dâng Con Trẻ Cho Chúa',
    labelEn: 'Child & Baby Dedication',
    icon: 'Baby',
    description: 'Cha mẹ kết ước nuôi dạy con theo đường lối Chúa trước Hội Thánh.',
  },
  [CareType.BEREAVEMENT]: {
    labelVi: 'Tang Chế & An Ủi Gia Đình',
    labelEn: 'Bereavement & Memorial Support',
    icon: 'Flower2',
    description: 'Đồng hành, tổ chức lễ tang và an ủi gia đình có người thân về nước Chúa.',
  },
};
