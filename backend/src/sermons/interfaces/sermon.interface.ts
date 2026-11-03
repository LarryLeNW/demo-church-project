export interface OutlinePoint {
  id: string;
  pointNumber: number;
  titleVi: string;
  titleEn: string;
  scriptureRef?: string;
  scriptureTextVi?: string;
  scriptureTextEn?: string;
  fillInBlankTextVi: string; // e.g. "Sự tạ ơn mở ra cánh cửa đón nhận {{bình an}} của Đức Chúa Trời."
  blankAnswersVi: string[]; // ["bình an"]
  fillInBlankTextEn: string; // e.g. "Thanksgiving opens the door to receiving God's {{peace}}."
  blankAnswersEn: string[]; // ["peace"]
}
