"use client";

import React, { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useLanguage } from "@/lib/i18n/language-context";
import { TactileButton } from "@/components/ui/tactile-button";
import {
  BookOpen,
  Video,
  Search,
  Download,
  Play,
  FileText,
  Filter,
  Sparkles,
  ExternalLink,
  X,
} from "lucide-react";

export default function LibraryPage() {
  const { isEn, bilingual } = useLanguage();
  const [activeTab, setActiveTab] = useState<"books" | "videos">("books");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [playingVideo, setPlayingVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  const categories = [
    { id: "all", labelVi: "Tất Cả Chủ Đề", labelEn: "All Topics" },
    { id: "theology", labelVi: "Thần Học Cơ Bản", labelEn: "Biblical Theology" },
    { id: "discipleship", labelVi: "Đời Sống Môn Đồ", labelEn: "Discipleship Life" },
    { id: "family", labelVi: "Hôn Nhân & Gia Đình", labelEn: "Marriage & Family" },
    { id: "leadership", labelVi: "Lãnh Đạo Mục Vụ", labelEn: "Pastoral Leadership" },
  ];

  const books = [
    {
      id: "b1",
      titleVi: "Nguyên Tắc Môn Đồ Hóa Vững Vàng",
      titleEn: "Foundations of Solid Discipleship",
      author: "Tabitha Nguyen",
      category: "discipleship",
      pages: 148,
      descVi: "Cẩm nang hướng dẫn từng bước đồng hành cùng tân tín hữu từ khi tin Chúa đến khi trở thành người phục sự trung tín.",
      descEn: "Step-by-step guidebook walking new believers from salvation to fruitful, lifelong Christian discipleship.",
      fileSize: "3.4 MB",
      format: "PDF",
    },
    {
      id: "b2",
      titleVi: "Giải Kinh Học Thực Hành Cho Tôi Tớ Chúa",
      titleEn: "Practical Hermeneutics for Servants of God",
      author: "Jack Lee",
      category: "theology",
      pages: 210,
      descVi: "Phương pháp đọc hiểu Kinh Thánh theo văn cảnh lịch sử - ngữ pháp và ứng dụng sứ điệp vào đời sống đương đại.",
      descEn: "Sound principles of biblical interpretation in grammatical-historical context with modern application.",
      fileSize: "4.8 MB",
      format: "PDF",
    },
    {
      id: "b3",
      titleVi: "Gia Đình Đặt Nền Tảng Trên Bàn Thờ Lời Chúa",
      titleEn: "Families Built Upon the Family Altar",
      author: "Zoya Hank",
      category: "family",
      pages: 120,
      descVi: "Xây dựng thì giờ tĩnh nguyện gia đình mỗi ngày, gắn kết vợ chồng và truyền trao đức tin sống động cho con cái.",
      descEn: "Cultivating daily family quiet times, strengthening marital bonds, and passing living faith to children.",
      fileSize: "2.9 MB",
      format: "PDF",
    },
    {
      id: "b4",
      titleVi: "Lãnh Đạo Đầy Ơn & Tinh Thần Đầy Tớ",
      titleEn: "Anointed Leadership & Servant Heart",
      author: "Spiritual Advance Ministry",
      category: "leadership",
      pages: 180,
      descVi: "Phẩm chất và kỹ năng cần có của người hướng dẫn nhóm nhỏ, chấp sự và trưởng ban mục vụ trong Hội Thánh.",
      descEn: "Essential character traits and practical skills for small group leaders, deacons, and ministry directors.",
      fileSize: "4.1 MB",
      format: "PDF",
    },
    {
      id: "b5",
      titleVi: "Tổng Luận 66 Sách Kinh Thánh",
      titleEn: "Survey of the 66 Books of the Bible",
      author: "Jack Lee",
      category: "theology",
      pages: 320,
      descVi: "Bản đồ toàn cảnh Cựu Ước và Tân Ước, chủ đề trung tâm của từng sách và sợi chỉ đỏ cứu chuộc xuyên suốt lịch sử.",
      descEn: "A panoramic survey of the Old and New Testaments, central themes, and the scarlet thread of redemption.",
      fileSize: "6.5 MB",
      format: "PDF",
    },
  ];

  const videos = [
    {
      id: "v1",
      titleVi: "Bí Quyết Giữ Lửa Tĩnh Nguyện & Cầu Thay Mỗi Ngày",
      titleEn: "Keys to Maintaining a Persistent Devotional Fire",
      speaker: "Tabitha Nguyen",
      category: "discipleship",
      duration: "42:15",
      youtubeId: "dQw4w9WgXcQ", // demo placeholder
      thumbnail: "/covers/bible-habit.svg",
      descVi: "Bài giảng bồi linh thực tế giúp vượt qua sự khô hạn tâm linh và xây dựng thói quen tương giao mật thiết với Chúa.",
      descEn: "Practical sermon on breaking spiritual dryness and establishing an intimate daily communion with God.",
    },
    {
      id: "v2",
      titleVi: "Giải Kinh Ma-thi-ơ: Bài Giảng Trên Núi & Đạo Nước Trời",
      titleEn: "Exposition of Matthew: Sermon on the Mount",
      speaker: "Jack Lee",
      category: "theology",
      duration: "58:30",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/covers/discipleship-101.svg",
      descVi: "Khám phá các phước lành và tiêu chuẩn công chính của vương quốc Đấng Christ trong thế giới hiện đại.",
      descEn: "Exploring the Beatitudes and the kingdom righteousness of Christ lived out in our modern context.",
    },
    {
      id: "v3",
      titleVi: "Hôn Nhân Trong Ý Muốn Chúa & Chữa Lành Mối Quan Hệ",
      titleEn: "God-Honoring Marriage & Relationship Healing",
      speaker: "Zoya Hank",
      category: "family",
      duration: "45:00",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/covers/leadership-foundations.svg",
      descVi: "Nguyên tắc giải quyết bất đồng trong tình yêu thương agape và lời khuyên thuộc linh cho các cặp vợ chồng trẻ.",
      descEn: "Principles for resolving conflict through Agape love and practical spiritual counsel for couples.",
    },
  ];

  // Filtering
  const filteredBooks = books.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      searchTerm === "" ||
      item.titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredVideos = videos.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      searchTerm === "" ||
      item.titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Title */}
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF5EE] border border-[#F17F34]/40 text-[#DE6D22] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#F17F34]" />
            <span>{bilingual("Thư Viện Thuộc Linh", "Spiritual Library")}</span>
          </div>
          <h1 className="font-scripture text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {bilingual("Kho Tài Liệu & Video Bài Giảng SAM", "SAM Resource Vault & Sermons")}
          </h1>
          <p className="text-xs sm:text-base text-slate-700 font-serif italic leading-relaxed">
            {bilingual(
              "Nguồn tư liệu thần học, sách bồi linh bồi dưỡng tâm linh và video bài giảng trang bị người hầu việc Chúa.",
              "Comprehensive biblical books, spiritual formation materials, and expository sermons equipping the saints."
            )}
          </p>
        </section>

        {/* Tab Switcher & Search Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-50/70 rounded-xl border border-amber-200/60 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "books"
                  ? "bg-[#F17F34] text-white shadow-xs font-bold"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{bilingual("Sách & Tài Liệu", "Books & Documents")}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {books.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "videos"
                  ? "bg-[#F17F34] text-white shadow-xs font-bold"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{bilingual("Video Bài Giảng", "Video Sermons")}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {videos.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={bilingual("Tìm kiếm tài liệu, diễn giả...", "Search books, topics, speakers...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F3] border border-amber-200/80 rounded-xl text-slate-900 focus:outline-none focus:border-[#F17F34] focus:ring-1 focus:ring-[#F17F34]/30"
            />
          </div>
        </section>

        {/* Categories Pill Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-800" />
            <span>{bilingual("Chủ đề:", "Filter:")}</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#F17F34] text-white shadow-2xs"
                  : "bg-white border border-amber-200/80 text-slate-700 hover:bg-amber-50"
              }`}
            >
              {isEn ? cat.labelEn : cat.labelVi}
            </button>
          ))}
        </div>

        {/* Tab 1: Books Content */}
        {activeTab === "books" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 sm:p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF5EE] text-[#F17F34] border border-[#F17F34]/20">
                        {book.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {book.format} • {book.fileSize}
                      </span>
                    </div>

                    <h3 className="font-scripture text-lg font-bold text-slate-900">
                      {isEn ? book.titleEn : book.titleVi}
                    </h3>
                    <p className="text-xs text-amber-900 font-serif">
                      {bilingual("Tác giả: ", "Author: ")}
                      <span className="font-bold">{book.author}</span>
                      <span className="text-slate-500 font-normal"> ({book.pages} {bilingual("trang", "pages")})</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {isEn ? book.descEn : book.descVi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => alert(bilingual("Đang chuẩn bị tải về bản PDF mẫu...", "Preparing sample PDF download..."))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF5EE] hover:bg-[#FDE8D7] text-[#DE6D22] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F17F34]" />
                      <span>{bilingual("Tải PDF Miễn Phí", "Download PDF")}</span>
                    </button>
                    <button
                      onClick={() => alert(bilingual("Đang mở trình đọc sách trực tuyến...", "Opening online reader..."))}
                      className="text-xs font-semibold text-slate-700 hover:text-[#F17F34] underline cursor-pointer"
                    >
                      {bilingual("Đọc Trực Tuyến", "Read Online")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-amber-200/70 text-slate-500 text-xs">
                {bilingual("Không tìm thấy tài liệu phù hợp với bộ lọc.", "No documents found matching your search.")}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Videos Content */}
        {activeTab === "videos" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs hover:border-[#F17F34] transition-all overflow-hidden flex flex-col group cursor-pointer"
                  onClick={() => setPlayingVideo({ title: isEn ? video.titleEn : video.titleVi, youtubeId: video.youtubeId })}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.titleVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.img-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'img-fallback w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-[#F17F34]/30 flex flex-col items-center justify-center text-amber-300';
                          fallback.innerHTML = '<span class="text-4xl font-serif">†</span>';
                          parent.prepend(fallback);
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#F17F34] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] text-white font-mono">
                      {video.duration}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#F17F34] uppercase tracking-wider">
                        {video.category}
                      </span>
                      <h3 className="font-scripture text-base font-bold text-slate-900 group-hover:text-[#F17F34] transition-colors leading-snug">
                        {isEn ? video.titleEn : video.titleVi}
                      </h3>
                      <p className="text-xs text-amber-900 font-serif font-medium">
                        {video.speaker}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 font-sans pt-1">
                      {isEn ? video.descEn : video.descVi}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-amber-200/70 text-slate-500 text-xs">
                {bilingual("Không tìm thấy video bài giảng phù hợp.", "No video sermons found matching your search.")}
              </div>
            )}
          </section>
        )}

        {/* Video Player Modal */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-950 rounded-2xl border border-amber-400/40 w-full max-w-3xl overflow-hidden shadow-2xl space-y-3 p-4">
              <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
                <span className="font-scripture font-bold text-sm truncate pr-2">
                  {playingVideo.title}
                </span>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive Video Container */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-3 p-6">
                  <div className="w-14 h-14 rounded-full bg-[#F17F34]/20 border border-[#F17F34] text-[#F17F34] mx-auto flex items-center justify-center animate-pulse">
                    <Play className="w-6 h-6 ml-0.5 fill-[#F17F34]" />
                  </div>
                  <p className="text-sm text-slate-300 font-serif italic">
                    {bilingual("Đang phát bài giảng mẫu từ thư viện SAM", "Playing sermon stream from SAM Vault")}
                  </p>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {playingVideo.youtubeId}
                  </span>
                </div>
              </div>

              <div className="text-right pt-1">
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
                >
                  {bilingual("Đóng", "Close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
