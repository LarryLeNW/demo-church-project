export enum SpiritualStage {
  SEEKER = 'seeker',
  NEW_BELIEVER = 'new_believer',
  BAPTISM_CANDIDATE = 'baptism_candidate',
  BAPTIZED = 'baptized',
  DISCIPLE = 'disciple',
  MINISTRY_LEADER = 'ministry_leader',
}

export enum BaptismStatus {
  NOT_STARTED = 'not_started',
  ENROLLED_CLASS = 'enrolled_class',
  COMPLETED_CLASS = 'completed_class',
  BAPTIZED = 'baptized',
}

export interface MilestoneHistoryRecord {
  stage: SpiritualStage;
  title: string;
  achievedAt: string;
  notes?: string;
  verifiedBy?: string;
}

export const STAGE_DETAILS: Record<
  SpiritualStage,
  {
    titleVi: string;
    titleEn: string;
    stepIndex: number;
    scriptureVi: string;
    scriptureEn: string;
    scriptureRef: string;
    descriptionVi: string;
  }
> = {
  [SpiritualStage.SEEKER]: {
    titleVi: 'Thân Hữu Tìm Hiểu',
    titleEn: 'Truth Seeker',
    stepIndex: 1,
    scriptureVi: 'Hãy xin, sẽ ban cho; hãy tìm, sẽ gặp; hãy gõ cửa, sẽ mở cho.',
    scriptureEn: 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.',
    scriptureRef: 'Ma-thi-ơ 7:7',
    descriptionVi: 'Đang tìm hiểu về tình yêu của Chúa Jesus và sinh hoạt tại Hội Thánh.',
  },
  [SpiritualStage.NEW_BELIEVER]: {
    titleVi: 'Tân Tín Hữu (Tiếp Nhận Chúa)',
    titleEn: 'New Believer',
    stepIndex: 2,
    scriptureVi: 'Vậy, nếu ai ở trong Đấng Christ, thì nấy là người dựng nên mới: những sự cũ đã qua đi, nầy mọi sự đều trở nên mới.',
    scriptureEn: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
    scriptureRef: '2 Cô-rinh-tô 5:17',
    descriptionVi: 'Đã cầu nguyện tin nhận Chúa Jesus làm Cứu Chúa và Chủ của đời sống mình.',
  },
  [SpiritualStage.BAPTISM_CANDIDATE]: {
    titleVi: 'Đang Học Lớp Báp-têm',
    titleEn: 'Baptism Candidate',
    stepIndex: 3,
    scriptureVi: 'Người nào tin và chịu phép báp-tem, sẽ được rỗi.',
    scriptureEn: 'Whoever believes and is baptized will be saved.',
    scriptureRef: 'Mác 16:16',
    descriptionVi: 'Tham gia học giáo lý căn bản đức tin chuẩn bị công khai tuyên xưng nhận Báp-têm.',
  },
  [SpiritualStage.BAPTIZED]: {
    titleVi: 'Đã Báp-têm & Dự Tiệc Thánh',
    titleEn: 'Baptized & Communion Member',
    stepIndex: 4,
    scriptureVi: 'Chúng ta đã bị chôn với Ngài bởi phép báp-tem trong sự chết Ngài, hầu cho Đấng Christ nhờ vinh hiển của Cha được từ kẻ chết sống lại thể nào, thì chúng ta cũng bước đi trong đời mới thể ấy.',
    scriptureEn: 'We were therefore buried with him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.',
    scriptureRef: 'Rô-ma 6:4',
    descriptionVi: 'Đã nhận Thánh lễ Báp-têm dưới nước và chính thức dự Thánh lễ Tiệc Thánh thông công cùng Hội Thánh.',
  },
  [SpiritualStage.DISCIPLE]: {
    titleVi: 'Môn Đồ Trưởng Thành',
    titleEn: 'Devoted Disciple',
    stepIndex: 5,
    scriptureVi: 'Nếu các ngươi hằng ở trong đạo ta, thì thật là môn đồ ta; các ngươi sẽ biết lẽ thật, và lẽ thật sẽ buông tha các ngươi.',
    scriptureEn: 'If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.',
    scriptureRef: 'Giăng 8:31-32',
    descriptionVi: 'Trung tín học Lời Chúa, tham gia nhóm nhỏ, tĩnh nguyện hằng ngày và nâng đỡ anh em mới.',
  },
  [SpiritualStage.MINISTRY_LEADER]: {
    titleVi: 'Nhân Sự & Lãnh Đạo Mục Vụ',
    titleEn: 'Ministry Leader / Servant',
    stepIndex: 6,
    scriptureVi: 'Hãy chăn bầy của Đức Chúa Trời đã giao phó cho anh em; làm trọn phận sự ấy chẳng phải vì miễn cưỡng, bèn là cách vui lòng, theo ý Đức Chúa Trời.',
    scriptureEn: 'Be shepherds of God’s flock that is under your care, watching over them—not because you must, but because you are willing, as God wants you to be.',
    scriptureRef: '1 Phi-e-rơ 5:2',
    descriptionVi: 'Hướng dẫn nhóm tế bào, dạy Trường Chúa Nhật, ban trị sự hoặc phụ trách ban ngành mục vụ.',
  },
};
