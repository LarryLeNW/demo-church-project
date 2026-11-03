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
import { ArrowLeft, Church, Globe } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toggleLang, bilingual, isEn } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg(
        bilingual(
          "Vui lòng điền đầy đủ các thông tin bắt buộc",
          "Please fill in all required fields"
        )
      );
      return;
    }

    if (password.length < 6) {
      setErrorMsg(
        bilingual(
          "Mật khẩu phải có tối thiểu 6 ký tự",
          "Password must be at least 6 characters"
        )
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await register({
        fullName,
        email,
        phone: phone || undefined,
        password,
      });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          bilingual(
            "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin",
            "Registration failed. Please check your information and try again"
          )
        );
      }
    } finally {
      setLoading(false);
    }
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
          {bilingual("Đăng Ký Tài Khoản Tín Hữu", "Register Church Member Account")}
        </h2>

        <p className="text-xs text-slate-600 italic font-serif px-2 max-w-sm">
          {bilingual(
            '"Ấy vậy, anh em không phải là người ngoại, nhưng là người đồng hương với các thánh đồ, và là người nhà của Đức Chúa Trời." — Ê-phê-sô 2:19',
            '"Consequently, you are no longer foreigners and strangers, but fellow citizens with God\'s people and also members of his household." — Ephesians 2:19'
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
              label={bilingual("Họ và Tên Thánh Đồ", "Full Legal / Christian Name")}
              type="text"
              placeholder={bilingual(
                "Nguyen Van A hoặc Joshua Nguyen",
                "Joshua Nguyen or John Doe"
              )}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <TactileInput
              label={bilingual("Địa chỉ Email", "Email Address")}
              type="email"
              autoComplete="email"
              placeholder="member@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TactileInput
              label={bilingual("Số Điện Thoại (Tùy chọn)", "Phone Number (Optional)")}
              type="tel"
              placeholder="(408) 555-0199"
              hint={bilingual(
                "Dùng nhận tin nhắn thăm viếng SMS",
                "Used for pastoral care and SMS updates"
              )}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <TactileInput
              label={bilingual("Mật khẩu", "Password")}
              type="password"
              placeholder={bilingual("Tối thiểu 6 ký tự", "Minimum 6 characters")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
                  ? bilingual("Đang tạo hồ sơ...", "Creating account...")
                  : bilingual("Hoàn Tất Đăng Ký", "Complete Registration")}
              </span>
            </TactileButton>
          </form>

          <div className="text-center pt-2 text-xs text-slate-600">
            <span>{bilingual("Đã có tài khoản? ", "Already have an account? ")}</span>
            <Link
              href="/login"
              className="font-bold text-indigo-950 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>{bilingual("Quay lại đăng nhập", "Back to sign in")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
