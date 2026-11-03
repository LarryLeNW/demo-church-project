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
import { Church, ShieldCheck, ArrowRight, ArrowLeft, Globe } from "lucide-react";

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

  const fillPastorDemo = () => {
    setEmail("admin@teacher.local");
    setPassword("AdminTeacher@2026");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      {/* Mobile-Friendly Top Bar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-950 p-2 -ml-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-800" />
          <span>{bilingual("Trang chủ", "Home")}</span>
        </Link>
        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-xs font-semibold text-slate-700 hover:bg-amber-50 shadow-2xs transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-amber-700" />
          <span>{isEn ? "Tiếng Việt (VI)" : "English (EN)"}</span>
        </button>
      </header>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-amber-300/80 text-slate-900 text-xs font-semibold shadow-2xs hover:scale-105 transition-transform"
        >
          <img src={SAM_LOGO_DATA_URL} alt="SAM" className="w-5 h-5 object-contain" />
          <span className="font-serif font-bold">SAM</span>
          <span className="text-[10px] text-amber-800 font-normal">• saministry.org</span>
        </Link>

        <h2 className="font-scripture text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {bilingual("Đăng Nhập Hội Thánh", "Church Member Login")}
        </h2>

        <p className="text-xs text-slate-600 italic font-serif px-2">
          {bilingual(
            '"Đến gần Đức Chúa Trời, thì Ngài sẽ đến gần anh em." — Gia-cơ 4:8',
            '"Come near to God and he will come near to you." — James 4:8'
          )}
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 rounded-2xl border border-amber-200/80 shadow-md shadow-amber-950/5 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TactileInput
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
              label={bilingual("Mật khẩu", "Password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-amber-300 text-amber-700 focus:ring-amber-500 w-4 h-4"
                />
                <span>{bilingual("Ghi nhớ đăng nhập", "Remember me")}</span>
              </label>
              <a href="#" className="font-medium text-indigo-900 hover:underline">
                {bilingual("Quên mật khẩu?", "Forgot password?")}
              </a>
            </div>

            <TactileButton
              type="submit"
              variant="primary"
              size="lg"
              withCross
              disabled={loading}
              className="w-full mt-2"
            >
              <span>
                {loading
                  ? bilingual("Đang xác thực...", "Authenticating...")
                  : bilingual("Đăng Nhập Vào Hệ Thống", "Sign In to Platform")}
              </span>
            </TactileButton>
          </form>

          {/* Quick Demo Fill */}
          <div className="pt-4 border-t border-amber-100 space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
              {bilingual("Tài Khoản Thử Nghiệm Nhanh", "Quick Demo Accounts")}
            </div>
            <button
              type="button"
              onClick={fillPastorDemo}
              className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-amber-50/80 text-amber-900 border border-amber-200 hover:bg-amber-100/70 transition-all flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="flex items-center gap-1.5 min-w-0 truncate">
                <Church className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="truncate">Senior Pastor (admin)</span>
              </span>
              <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 font-mono shrink-0">
                {bilingual("1-Click Điền", "1-Click Demo")}
              </span>
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-slate-600">
            <span>
              {bilingual("Chưa có tài khoản tín hữu? ", "Don't have an account yet? ")}
            </span>
            <Link
              href="/register"
              className="font-bold text-indigo-950 hover:underline inline-flex items-center gap-1"
            >
              <span>{bilingual("Đăng ký tham gia", "Register now")}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
