"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { SAM_LOGO_DATA_URL } from "@/lib/sam-logo";
import { TactileInput } from "@/components/ui/tactile-input";
import { TactileButton } from "@/components/ui/tactile-button";
import { ApiError } from "@/lib/api/client";
import { FixedWorldMapBackground } from "@/components/fixed-world-map-background";
import { ShieldCheck, ArrowLeft, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { lang, toggleLang, bilingual, isEn } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(
        bilingual(
          "Vui lòng điền đầy đủ email và mật khẩu",
          "Please enter both email and password"
        )
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          bilingual(
            "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin",
            "Login failed. Please check your credentials and try again"
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          bilingual(
            "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin",
            "Login failed. Please check your credentials and try again"
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <FixedWorldMapBackground variant="vivid" />

      {/* Mobile-Friendly Top Bar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white p-2 -ml-2 rounded-lg transition-colors drop-shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>{bilingual("Trang chủ", "Home")}</span>
        </Link>
        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white hover:bg-white/15 shadow-2xs transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-amber-300" />
          <span>{isEn ? "Tiếng Việt (VI)" : "English (EN)"}</span>
        </button>
      </header>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center animate-fade-up">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-white/20 hover:border-amber-400/50 text-white text-xs sm:text-sm font-semibold shadow-xl hover:scale-105 transition-all group"
        >
          {/* Huy hiệu tròn nền sáng bảo vệ logo đỏ SAM luôn rực rỡ, không bị chìm hay phản bóng nền */}
          <div className="w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center p-0.5 shrink-0">
            <img src={SAM_LOGO_DATA_URL} alt="Spiritual Advance Ministry" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
            Spiritual Advance Ministry
          </span>
        </Link>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-scale-in delay-75">
        <div className="bg-slate-950/50 backdrop-blur-xl py-6 px-4 sm:py-8 sm:px-10 rounded-3xl border border-white/20 shadow-2xl space-y-5 text-white">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-medium text-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TactileInput
              variant="glass"
              label={bilingual("Địa chỉ Email", "Email Address")}
              type="email"
              autoComplete="email"
              placeholder={bilingual(
                "pastor@church.org hoặc tinhuu@gmail.com",
                "pastor@church.org or member@gmail.com"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TactileInput
              variant="glass"
              label={bilingual("Mật khẩu", "Password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-white/30 bg-white/10 text-primary-600 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <span>{bilingual("Ghi nhớ đăng nhập", "Remember me")}</span>
              </label>
              <a href="#" className="font-medium text-amber-300 hover:text-amber-200 hover:underline">
                {bilingual("Quên mật khẩu?", "Forgot password?")}
              </a>
            </div>

            <TactileButton
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full mt-2 rounded-xl py-2.5 text-sm font-semibold shadow-md cursor-pointer"
            >
              <span>
                {loading
                  ? bilingual("Đang đăng nhập...", "Signing in...")
                  : bilingual("Đăng Nhập", "Sign In")}
              </span>
            </TactileButton>
          </form>

          {/* Quick Demo Login */}
          <div className="pt-4 border-t border-white/15 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 text-center font-serif">
              {bilingual("Tài Khoản Quản Trị Demo", "Demo Admin Account")}
            </div>
            <div>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin("admin@teacher.local", "AdminTeacher@2026")}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Admin (Ban Quản Trị Hệ Thống)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
