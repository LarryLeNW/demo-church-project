export type Language = "VI" | "EN";

export interface Translations {
  [key: string]: {
    VI: string;
    EN: string;
  };
}

export const translations: Translations = {
  // Brand & General
  "brand.name": {
    VI: "SAM • Spiritual Advance Ministry",
    EN: "SAM • Spiritual Advance Ministry",
  },
  "brand.tagline": {
    VI: "Tận Hiến Trang Bị Môn Đồ Chúa • saministry.org",
    EN: "We Are Devoted In Equipping People • saministry.org",
  },
  "brand.platform": {
    VI: "Mục Vụ Tiến Bước Thuộc Linh (SAM)",
    EN: "Spiritual Advance Ministry (SAM)",
  },
  "brand.subtitle": {
    VI: "Nền Tảng Đào Tạo & Môn Đồ Hóa • saministry",
    EN: "Discipleship & Training Platform • saministry",
  },

  // Navigation Sections
  "nav.spiritual_life": {
    VI: "Đời Sống Thuộc Linh",
    EN: "Spiritual Life",
  },
  "nav.community": {
    VI: "Cộng Đồng & Thông Công",
    EN: "Community & Fellowship",
  },
  "nav.service": {
    VI: "Phụng Sự & Dâng Hiến",
    EN: "Service & Stewardship",
  },
  "nav.leadership": {
    VI: "Chỉ Huy & Mục Vụ Cấp Cao",
    EN: "Pastoral Leadership",
  },

  // Navigation Items
  "nav.altar": {
    VI: "Bàn Thờ Phượng",
    EN: "Worship Sanctuary",
  },
  "nav.bible": {
    VI: "Đọc Kinh Thánh Hằng Ngày",
    EN: "Daily Bible Reading",
  },
  "nav.scripture": {
    VI: "Ghi Nhớ Lời Chúa (SRS)",
    EN: "Scripture Memory (SRS)",
  },
  "nav.prayers": {
    VI: "Tường Cầu Thay",
    EN: "Prayer Wall",
  },
  "nav.sermons": {
    VI: "Ghi Chú Bài Giảng",
    EN: "Sermon Vault & Notes",
  },
  "nav.pathway": {
    VI: "Hành Trình Đức Tin",
    EN: "Discipleship Pathway",
  },
  "nav.courses": {
    VI: "Môn Đồ Hóa & Bài Giảng",
    EN: "Courses & Sunday School",
  },
  "nav.groups": {
    VI: "Nhóm Nhỏ (Life Groups)",
    EN: "Small Groups / Life Groups",
  },
  "nav.events": {
    VI: "Lịch Sự Kiện & RSVP",
    EN: "Church Calendar & RSVP",
  },
  "nav.checkin": {
    VI: "Điểm Danh Thiếu Nhi",
    EN: "Kids Safe Check-in",
  },
  "nav.communications": {
    VI: "Bản Tin & SMS Khẩn",
    EN: "Church Bulletin & SMS",
  },
  "nav.giving": {
    VI: "Dâng Hiến (Stripe & 501c3)",
    EN: "Giving & 501(c)(3) Tax",
  },
  "nav.volunteers": {
    VI: "Ban Phụng Vụ & Lịch Trực",
    EN: "Volunteer Ministries & Roster",
  },
  "nav.facilities": {
    VI: "Phòng Nhóm & Thiết Bị",
    EN: "Facilities & Equipment",
  },
  "nav.analytics": {
    VI: "Bảng Chỉ Huy (Analytics)",
    EN: "Executive Health Cockpit",
  },
  "nav.pastoral": {
    VI: "Sổ Chăm Sóc & Gia Đình",
    EN: "Pastoral Care & Households",
  },

  // Roles
  "role.senior_pastor": {
    VI: "Mục Sư Quản Nhiệm",
    EN: "Senior Pastor",
  },
  "role.admin": {
    VI: "Ban Trị Sự",
    EN: "Church Admin",
  },
  "role.ministry_leader": {
    VI: "Trưởng Ban Mục Vụ",
    EN: "Ministry Leader",
  },
  "role.member": {
    VI: "Tín Hữu Môn Đồ",
    EN: "Disciple Member",
  },
  "role.parent": {
    VI: "Phụ Huynh Thiếu Nhi",
    EN: "Parent (Kids Ministry)",
  },

  // Role Simulator
  "role_simulator.label": {
    VI: "Góc Nhìn Vai Trò:",
    EN: "Role Simulator:",
  },
  "role_simulator.reset": {
    VI: "Mặc định",
    EN: "Default",
  },

  // Common UI Actions
  "action.login": {
    VI: "Đăng Nhập",
    EN: "Sign In",
  },
  "action.logout": {
    VI: "Đăng Xuất",
    EN: "Sign Out",
  },
  "action.register": {
    VI: "Đăng Ký",
    EN: "Register",
  },
  "action.save": {
    VI: "Lưu",
    EN: "Save",
  },
  "action.cancel": {
    VI: "Hủy",
    EN: "Cancel",
  },
  "action.close": {
    VI: "Đóng",
    EN: "Close",
  },
  "action.confirm": {
    VI: "Xác Nhận",
    EN: "Confirm",
  },
  "action.search": {
    VI: "Tìm kiếm...",
    EN: "Search...",
  },
  "action.filter": {
    VI: "Bộ Lọc",
    EN: "Filter",
  },
  "action.loading": {
    VI: "Đang tải...",
    EN: "Loading...",
  },
  "action.view_details": {
    VI: "Xem Chi Tiết",
    EN: "View Details",
  },

  // Header & Campuses
  "header.font_scale_title": {
    VI: "Phóng to / Thu nhỏ cỡ chữ cho Mục sư & Tín hữu cao niên",
    EN: "Adjust font size for Pastors & Senior members",
  },
  "header.campus_dallas": {
    VI: "Dallas Main Campus",
    EN: "Dallas Main Campus",
  },
  "header.campus_houston": {
    VI: "Houston Campus",
    EN: "Houston Campus",
  },
  "header.campus_fortworth": {
    VI: "Fort Worth Campus",
    EN: "Fort Worth Campus",
  },
  "header.campus_austin": {
    VI: "Austin Campus",
    EN: "Austin Campus",
  },

  // Footer & Verses
  "footer.benediction": {
    VI: "Nguyện ân điển của Chúa Cứu Thế Jesus, tình yêu thương của Đức Chúa Trời, và sự thông công của Đức Thánh Linh ở cùng hết thảy anh em. — 2 Cô-rinh-tô 13:14",
    EN: "The grace of the Lord Jesus Christ, and the love of God, and the communion of the Holy Ghost, be with you all. Amen. — 2 Corinthians 13:14",
  },

  // Dashboard Welcome
  "dash.welcome_pastor": {
    VI: "Bình An Dưới Chân Thập Tự Giá, Mục Sư",
    EN: "Peace in Christ, Pastor",
  },
  "dash.welcome_leader": {
    VI: "Chào Trưởng Ban Mục Vụ",
    EN: "Welcome, Ministry Leader",
  },
  "dash.welcome_member": {
    VI: "Chào Tín Hữu Môn Đồ",
    EN: "Welcome, Disciple in Christ",
  },
  "dash.welcome_parent": {
    VI: "Khu Vực Phụ Huynh Lớp Thiếu Nhi",
    EN: "Children Ministry Parent Portal",
  },
  "dash.quick_actions": {
    VI: "Tác Vụ Nhanh",
    EN: "Quick Actions",
  },
  "dash.kpis": {
    VI: "Chỉ Số Trọng Yếu",
    EN: "Key Metrics",
  },

  // Home Page
  "home.hero_badge": {
    VI: "Spiritual Advance Ministry • Tận Hiến Trang Bị Môn Đồ Chúa",
    EN: "Spiritual Advance Ministry • We Are Devoted In Equipping People",
  },
  "home.hero_title_1": {
    VI: "Mục Vụ Tiến Bước Thuộc Linh",
    EN: "Spiritual Advance Ministry",
  },
  "home.hero_title_2": {
    VI: "Trang Bị & Môn Đồ Hóa (saministry)",
    EN: "Equipping Servants for God (SAM)",
  },
  "home.hero_desc": {
    VI: "Chúng tôi hiện diện để vun trồng, nâng tầm và trang bị cho các tôi tớ Chúa: Kho bài giảng chuyên sâu, Lớp Trường Chúa Nhật, Nhóm nhỏ thông công, Tường cầu thay, và Dâng hiến chuẩn IRS 501(c)(3).",
    EN: "We exist to cultivate, elevate, and equip the servants of God to bring people closer to God and to be His faithful servants through actionable training, small groups, prayer wall, and giving.",
  },
  "home.btn_enter": {
    VI: "Vào Bàn Thờ Phượng & Học Lời Chúa",
    EN: "Enter Sanctuary & Bible LMS",
  },
  "home.btn_give": {
    VI: "Dâng Hiến Vì Nhà Chúa",
    EN: "Online Giving (501c3)",
  },
  "home.btn_system": {
    VI: "Hệ Thống Mục Vụ",
    EN: "Ministry Health",
  },
  "home.john316_title": {
    VI: "CÂU GỐC NỀN TẢNG • GIĂNG 3:16 (RVV11 / NIV)",
    EN: "FOUNDATIONAL SCRIPTURE • JOHN 3:16 (NIV)",
  },
  "home.john316_quote": {
    VI: "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.",
    EN: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  },
};
