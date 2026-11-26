"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { useLanguage } from "@/lib/i18n/language-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  BookOpen,
  Video,
  Search,
  Download,
  Play,
  FileText,
  Filter,
  Sparkles,
  X,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  ChevronRight,
  Flame,
} from "lucide-react";

export default function LibraryPage() {
  const { isEn, bilingual } = useLanguage();
  const [activeTab, setActiveTab] = useState<"books" | "videos">("books");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [playingVideo, setPlayingVideo] = useState<{ title: string; speaker: string; duration: string } | null>(null);
  const [readingBook, setReadingBook] = useState<{ title: string; author: string; pages: number } | null>(null);

  const categories = [
    { id: "all", labelVi: "Tất Cả Chủ Đề", labelEn: "All Topics" },
    { id: "theology", labelVi: "Giải Kinh & Thần Học", labelEn: "Biblical Exegesis" },
    { id: "discipleship", labelVi: "Môn Đồ Hóa Căn Bản", labelEn: "Discipleship Life" },
    { id: "habits", labelVi: "Thói Quen Thuộc Linh", labelEn: "Spiritual Disciplines" },
    { id: "leadership", labelVi: "Lãnh Đạo Mục Vụ", labelEn: "Pastoral Leadership" },
  ];

  const books = [
    {
      id: "b1",
      titleVi: "Nguyên Tắc Môn Đồ Hóa Vững Vàng",
      titleEn: "Foundations of Solid Discipleship",
      author: "Chấp sự Tabitha Nguyen",
      authorRoleVi: "Chủ tịch SAM • Giảng viên Môn đồ hóa",
      authorRoleEn: "SAM President • Discipleship Faculty",
      category: "discipleship",
      pages: 148,
      cover: "/covers/discipleship-101.svg",
      descVi: "Cẩm nang hướng dẫn từng bước đồng hành cùng tân tín hữu từ khi tin Chúa đến khi trở thành người phục sự trung tín của Đấng Christ.",
      descEn: "Step-by-step guidebook walking new believers from salvation to fruitful, lifelong Christian discipleship.",
      fileSize: "3.4 MB",
      format: "PDF",
    },
    {
      id: "b2",
      titleVi: "Giải Kinh Học Thực Hành Cho Tôi Tớ Chúa",
      titleEn: "Practical Hermeneutics for Servants of God",
      author: "Mục sư Jack Lee",
      authorRoleVi: "Học giả Kinh Thánh • Dallas Fellowship",
      authorRoleEn: "Biblical Scholar • Dallas Fellowship",
      category: "theology",
      pages: 210,
      cover: "/covers/leadership-foundations.svg",
      descVi: "Phương pháp đọc hiểu Kinh Thánh theo văn cảnh lịch sử - ngữ pháp và bố cục bài dạy Trường Chúa Nhật chuẩn mực.",
      descEn: "Sound principles of biblical interpretation in grammatical-historical context with modern preaching application.",
      fileSize: "4.8 MB",
      format: "PDF",
    },
    {
      id: "b3",
      titleVi: "Kỷ Luật Tĩnh Nguyện & Lửa Thiêng Cầu Nguyện",
      titleEn: "Spiritual Habits & Persistent Devotional Life",
      author: "Ban Giảng Huấn SAM",
      authorRoleVi: "Đội ngũ Mục vụ Đào tạo SAM",
      authorRoleEn: "SAM Pastoral Equipping Team",
      category: "habits",
      pages: 120,
      cover: "/covers/bible-habit.svg",
      descVi: "Phương pháp SOAP đọc Kinh Thánh hằng ngày, kỹ thuật ngắt quãng ghi nhớ Lời Chúa và phá tan khô hạn thuộc linh.",
      descEn: "SOAP Bible study method, spaced-repetition Scripture memory, and breaking spiritual dryness.",
      fileSize: "2.9 MB",
      format: "PDF",
    },
    {
      id: "b4",
      titleVi: "Lãnh Đạo Nhóm Nhỏ Với Trái Tim Người Đầy Tớ",
      titleEn: "Small Group Leadership with a Servant Heart",
      author: "Chấp sự Tabitha Nguyen & Zoya Hank",
      authorRoleVi: "Cố vấn Trường Chúa Nhật & Chăm sóc",
      authorRoleEn: "Sunday School & Pastoral Care",
      category: "leadership",
      pages: 180,
      cover: "/covers/leadership-foundations.svg",
      descVi: "Phẩm chất và kỹ năng cần có của người hướng dẫn nhóm tế bào, chấp sự và ban điều hành mục vụ Hội Thánh.",
      descEn: "Essential character traits and practical skills for small group leaders, deacons, and ministry directors.",
      fileSize: "4.1 MB",
      format: "PDF",
    },
  ];

  const videos = [
    {
      id: "v1",
      titleVi: "Bí Quyết Giữ Lửa Tĩnh Nguyện & Tương Giao Với Chúa",
      titleEn: "Keys to Maintaining a Persistent Devotional Fire",
      speaker: "Chấp sự Tabitha Nguyen",
      speakerRoleVi: "Chủ tịch SAM",
      speakerRoleEn: "SAM President",
      category: "habits",
      duration: "42:15",
      thumbnail: "/covers/bible-habit.svg",
      descVi: "Bài giảng bồi linh thực tế giúp tín hữu thiết lập thì giờ tĩnh nguyện buổi sáng và nuôi dưỡng đời sống cầu nguyện bền bỉ.",
      descEn: "Practical sermon on breaking spiritual dryness and establishing an intimate daily communion with God.",
    },
    {
      id: "v2",
      titleVi: "Giải Kinh Ma-thi-ơ: Bài Giảng Trên Núi & Tiêu Chuẩn Nước Trời",
      titleEn: "Exposition of Matthew: Sermon on the Mount",
      speaker: "Mục sư Jack Lee",
      speakerRoleVi: "Dallas Theological Fellowship",
      speakerRoleEn: "Dallas Theological Fellowship",
      category: "theology",
      duration: "58:30",
      thumbnail: "/covers/discipleship-101.svg",
      descVi: "Khám phá các phước lành và tiêu chuẩn công chính của vương quốc Đấng Christ được áp dụng trong đời sống đương đại.",
      descEn: "Exploring the Beatitudes and the kingdom righteousness of Christ lived out in our modern context.",
    },
    {
      id: "v3",
      titleVi: "Kỹ Năng Thăm Viếng & Nâng Đỡ Tín Hữu Ngã Lòng",
      titleEn: "Pastoral Visitation & Restoring Weary Souls",
      speaker: "Ban Giảng Huấn SAM",
      speakerRoleVi: "Đội ngũ Chăm sóc Mục vụ",
      speakerRoleEn: "Pastoral Care Team",
      category: "leadership",
      duration: "45:00",
      thumbnail: "/covers/leadership-foundations.svg",
      descVi: "Nguyên tắc lắng nghe mục vụ, giải quyết xung đột trong yêu thương và khích lệ các gia đình tín hữu vắng mặt dài ngày.",
      descEn: "Principles for pastoral listening, conflict resolution in love, and comforting absentee families.",
    },
  ];

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
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-transparent">
      <FixedWorldMapBackground />
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20 animate-fade-in text-white">
          <Breadcrumb
            items={[
              { label: bilingual("Thư Viện & Kho Bài Giảng", "Library & Sermon Vault") },
            ]}
          />
          <span className="text-xs text-amber-200/90 font-serif italic hidden sm:inline">
            {bilingual("Kho sách, tài liệu & bài giảng bồi linh", "Spiritual books, documents & sermon media")}
          </span>
        </div>

        {/* ============================================================== */}
        {/* 1. EDITORIAL HEADER DIRECTLY ON MAP (No enclosing box) */}
        {/* ============================================================== */}
        <section className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-amber-300 font-serif text-xs uppercase tracking-widest">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{bilingual("Kho Tàng Tri Thức Thuộc Linh", "Spiritual Treasury & Vault")}</span>
          </div>

          <h1 className="font-scripture text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md [text-wrap:balance]">
            {bilingual("Thư Viện Tài Liệu & Bài Giảng Bồi Linh", "Spiritual Library & Sermon Vault")}
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 font-serif italic max-w-2xl mx-auto drop-shadow-xs">
            {bilingual(
              "\"Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.\" — Thi-thiên 119:105",
              "\"Your word is a lamp to my feet and a light to my path.\" — Psalm 119:105"
            )}
          </p>
        </section>

        {/* ============================================================== */}
        {/* 2. FLOATING PILL RIBBON CONTROLS (Tabs & Search Bar) */}
        {/* ============================================================== */}
        <section className="bg-slate-950/60 backdrop-blur-xl rounded-full border border-white/20 p-2 sm:px-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-up">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("books")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-serif transition-all cursor-pointer ${
                activeTab === "books"
                  ? "bg-gradient-to-r from-primary-600 to-amber-600 text-white font-bold shadow-md shadow-primary-900/40"
                  : "text-slate-300 hover:text-white hover:bg-white/10 font-medium"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{bilingual("Sách Bồi Linh", "Study Books")}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "books" ? "bg-white/25 text-white" : "bg-white/10 text-slate-300"
              }`}>
                {books.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-serif transition-all cursor-pointer ${
                activeTab === "videos"
                  ? "bg-gradient-to-r from-primary-600 to-amber-600 text-white font-bold shadow-md shadow-primary-900/40"
                  : "text-slate-300 hover:text-white hover:bg-white/10 font-medium"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{bilingual("Video Bài Giảng", "Video Sermons")}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "videos" ? "bg-white/25 text-white" : "bg-white/10 text-slate-300"
              }`}>
                {videos.length}
              </span>
            </button>
          </div>

          {/* Search Box in Glass */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-amber-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={bilingual("Tìm kiếm tài liệu, diễn giả...", "Search books, topics, speakers...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-slate-300 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 min-h-[40px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. CATEGORY PILL CHIPS (Clean circular filters, no box) */}
        {/* ============================================================== */}
        <section className="flex flex-wrap items-center justify-center gap-2 text-center animate-fade-up delay-75">
          <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5 mr-2 font-serif drop-shadow-xs">
            <Filter className="w-3.5 h-3.5 text-amber-300" />
            <span>{bilingual("Chủ Đề:", "Topics:")}</span>
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif transition-all cursor-pointer min-h-[36px] ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30 scale-105"
                    : "bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25"
                }`}
              >
                {isEn ? cat.labelEn : cat.labelVi}
              </button>
            );
          })}
        </section>

        {/* ============================================================== */}
        {/* 4. TAB 1: SÁCH & TÀI LIỆU (Cathedral Arch Book Gallery) */}
        {/* ============================================================== */}
        {activeTab === "books" && (
          <section className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {filteredBooks.map((book, idx) => (
                <div
                  key={book.id}
                  className="rounded-t-[44px] rounded-b-3xl bg-slate-950/50 backdrop-blur-xl border border-white/20 hover:border-amber-400/50 shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col sm:flex-row gap-6 justify-between group text-white"
                  style={{ animationDelay: `${(idx + 1) * 75}ms` }}
                >
                  {/* Cathedral Arched Book Cover */}
                  <div className="relative aspect-[3/4] w-full sm:w-40 rounded-t-[36px] rounded-b-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Image
                      src={book.cover}
                      alt={book.titleVi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/80 text-amber-300 border border-amber-400/40 font-mono">
                      {book.format}
                    </div>
                    {/* Golden Bookmark ribbon simulation */}
                    <div className="absolute top-0 right-4 w-4 h-8 bg-amber-500 shadow-md flex items-end justify-center pb-1">
                      <Bookmark className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/20">
                          {book.category}
                        </span>
                        <span className="text-xs text-slate-400 font-sans font-medium">
                          {book.pages} {bilingual("trang", "pages")} • {book.fileSize}
                        </span>
                      </div>

                      <h3 className="font-scripture text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug [text-wrap:balance]">
                        {isEn ? book.titleEn : book.titleVi}
                      </h3>

                      <p className="text-xs text-amber-300 font-serif font-semibold">
                        {book.author}
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3 [text-wrap:pretty]">
                        {isEn ? book.descEn : book.descVi}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            bilingual(
                              `Đang chuẩn bị tải về bản PDF '${book.titleVi}'...`,
                              `Preparing PDF download for '${book.titleEn}'...`
                            )
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{bilingual("Tải PDF Miễn Phí", "Download PDF")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setReadingBook({
                            title: isEn ? book.titleEn : book.titleVi,
                            author: book.author,
                            pages: book.pages,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                        <span>{bilingual("Đọc Thử Mẫu", "Preview Book")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-slate-950/60 backdrop-blur-xl border border-white/20 text-white text-sm">
                {bilingual("Không tìm thấy tài liệu phù hợp với từ khóa.", "No literature found matching your search.")}
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* 5. TAB 2: VIDEO BÀI GIẢNG (Cathedral Arched Media Showcase) */}
        {/* ============================================================== */}
        {activeTab === "videos" && (
          <section className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {filteredVideos.map((video, idx) => (
                <div
                  key={video.id}
                  className="rounded-t-[44px] rounded-b-3xl bg-slate-950/50 backdrop-blur-xl border border-white/20 hover:border-amber-400/50 shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer text-white"
                  style={{ animationDelay: `${(idx + 1) * 75}ms` }}
                  onClick={() =>
                    setPlayingVideo({
                      title: isEn ? video.titleEn : video.titleVi,
                      speaker: video.speaker,
                      duration: video.duration,
                    })
                  }
                >
                  {/* Cathedral Arched Video Frame */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden rounded-t-[44px]">
                    <Image
                      src={video.thumbnail}
                      alt={video.titleVi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-amber-600 text-white border-2 border-amber-300 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-1 fill-white" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/85 text-xs text-amber-300 font-mono flex items-center gap-1.5 border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{video.duration}</span>
                    </span>
                  </div>

                  <div className="p-6 sm:p-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-0.5 rounded-full border border-white/20">
                        {video.category}
                      </span>
                    </div>

                    <h3 className="font-scripture text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug [text-wrap:balance]">
                      {isEn ? video.titleEn : video.titleVi}
                    </h3>

                    <p className="text-xs text-amber-300 font-serif font-semibold">
                      {video.speaker}
                    </p>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans [text-wrap:pretty]">
                      {isEn ? video.descEn : video.descVi}
                    </p>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:underline">
                      <span>{bilingual("Xem Bài Giảng Trực Tuyến", "Watch Full Sermon")}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-slate-950/60 backdrop-blur-xl border border-white/20 text-white text-sm">
                {bilingual("Không tìm thấy video bài giảng phù hợp.", "No video sermons found matching your search.")}
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* MODAL: Video Player */}
        {/* ============================================================== */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-950 rounded-3xl border border-amber-400/40 w-full max-w-3xl overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 text-left animate-scale-in">
              <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase font-serif tracking-widest block">
                    {bilingual("Phát Video Bài Giảng SAM", "Now Playing")}
                  </span>
                  <h3 className="font-scripture font-bold text-base sm:text-lg text-white truncate max-w-xl">
                    {playingVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Streaming Mock Player */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center border border-white/10">
                <div className="w-16 h-16 rounded-full bg-primary-700/20 border-2 border-primary-700 flex items-center justify-center text-primary-700 mb-3 animate-pulse">
                  <Play className="w-8 h-8 ml-1 fill-primary-700" />
                </div>
                <p className="font-serif text-lg text-white font-bold">
                  {playingVideo.speaker}
                </p>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  {bilingual("Độ dài:", "Duration:")} {playingVideo.duration} • Full HD 1080p
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-serif">
                  Spiritual Advance Ministry • Sermon Vault
                </span>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
                >
                  {bilingual("Đóng", "Close")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: Đọc Sách Trực Tuyến (Book Sample Reader) */}
        {/* ============================================================== */}
        {readingBook && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-950/90 backdrop-blur-2xl rounded-3xl border border-white/20 w-full max-w-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-left animate-scale-in text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase font-serif tracking-widest block">
                    {bilingual("Trình Đọc Bản Thảo Trực Tuyến", "Online Reader Preview")}
                  </span>
                  <h3 className="font-scripture font-bold text-xl text-white">
                    {readingBook.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-serif mt-0.5">
                    {bilingual("Tác giả:", "Author:")} {readingBook.author} • {readingBook.pages} {bilingual("trang", "pages")}
                  </p>
                </div>
                <button
                  onClick={() => setReadingBook(null)}
                  className="p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Book Excerpt Page */}
              <div className="bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xs space-y-4 font-serif text-slate-200 leading-relaxed text-sm sm:text-base [text-wrap:pretty]">
                <p className="italic text-amber-300 font-bold border-l-4 border-amber-400 pl-3">
                  {bilingual(
                    "Trích đoạn Lời Mở Đầu: 'Môn đồ hóa không chỉ là một chương trình 10 tuần, mà là hành trình suốt một đời đồng đi với Cứu Chúa.'",
                    "Excerpt from Preface: 'Discipleship is not a ten-week program; it is a lifelong walk in communion with our Savior.'"
                  )}
                </p>
                <p>
                  {bilingual(
                    "Khi Chúa Jesus kêu gọi các sứ đồ bên bờ hồ Ga-li-lê, Ngài không trao cho họ một bản hợp đồng, mà là một lời mời gọi bước đi trong mối tương giao sống động: 'Hãy theo Ta, và Ta sẽ khiến các ngươi trở nên tay đánh lưới người.'",
                    "When Jesus summoned His disciples by the Sea of Galilee, He offered not an employment contract, but an invitation into living relationship: 'Follow me, and I will make you fishers of men.'"
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-serif">
                  {bilingual("Bản quyền © Spiritual Advance Ministry (SAM)", "Copyright © Spiritual Advance Ministry")}
                </span>
                <button
                  onClick={() => setReadingBook(null)}
                  className="px-5 py-2 rounded-full bg-primary-700 hover:bg-primary-600 text-xs font-bold text-white cursor-pointer transition-all shadow-sm"
                >
                  {bilingual("Đóng Cửa Sổ", "Close Preview")}
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
