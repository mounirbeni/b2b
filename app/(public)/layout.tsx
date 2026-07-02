import Link from "next/link";
import { auth } from "@/lib/auth";
import { Search, LayoutDashboard, CalendarClock, LogIn } from "lucide-react";

function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-[10px]"
      style={{ width: size, height: size, boxShadow: "0 6px 16px -6px rgba(37,99,235,0.5)" }}
    >
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
        <defs>
          <linearGradient id="pub-bm" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#pub-bm)" />
        <path d="M18 9.5c-.7 0-1.3.5-1.4 1.2l-.7 4.2-4.2.7c-.8.1-1.3.8-1.2 1.6.1.6.6 1.1 1.2 1.2l4.2.7.7 4.2c.1.8.9 1.3 1.6 1.2.6-.1 1.1-.6 1.2-1.2l.7-4.2 4.2-.7c.8-.1 1.3-.9 1.2-1.6-.1-.6-.6-1.1-1.2-1.2l-4.2-.7-.7-4.2c-.1-.7-.7-1.2-1.4-1.2Z" fill="#fff" fillOpacity="0.95" />
      </svg>
    </span>
  );
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isPatient = session?.user?.role === "patient";
  const isClinic = session?.user?.role === "clinic";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-[17px] font-bold tracking-tight text-slate-900">
              MBN<span className="text-primary"> Health</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[14px] font-medium text-slate-600 md:flex">
            <Link href="/#features" className="transition-colors hover:text-slate-900">المميزات</Link>
            <Link href="/#clinics" className="transition-colors hover:text-slate-900">للعيادات</Link>
            <Link href="/#how" className="transition-colors hover:text-slate-900">كيف تعمل</Link>
            <Link href="/#faq" className="transition-colors hover:text-slate-900">الأسئلة الشائعة</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
            >
              <Search className="h-4 w-4" /> ابحث
            </Link>
            {isPatient ? (
              <Link href="/patient/appointments" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <CalendarClock className="h-4 w-4" /> حجوزاتي
              </Link>
            ) : (
              <Link href="/patient/login" className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex">
                <LogIn className="h-4 w-4" /> دخول المرضى
              </Link>
            )}
            {isClinic ? (
              <Link
                href="/medflow/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                <LayoutDashboard className="h-4 w-4" /> لوحة التحكم
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                دخول العيادات
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5">
                <BrandMark size={30} />
                <span className="text-[16px] font-bold tracking-tight text-slate-900">MBN<span className="text-primary"> Health</span></span>
              </Link>
              <p className="mt-3 text-[13.5px] leading-relaxed text-slate-500">
                منصة تربط المرضى بعيادات موثوقة، وتمنح العيادات نظامًا متكاملًا لإدارة المواعيد والمرضى.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-[13px] font-semibold text-slate-900">المنصة</p>
                <ul className="space-y-2.5 text-[13.5px] text-slate-500">
                  <li><Link href="/search" className="hover:text-primary">ابحث عن عيادة</Link></li>
                  <li><Link href="/register" className="hover:text-primary">سجّل عيادتك</Link></li>
                  <li><Link href="/#features" className="hover:text-primary">المميزات</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-[13px] font-semibold text-slate-900">الحساب</p>
                <ul className="space-y-2.5 text-[13.5px] text-slate-500">
                  <li><Link href="/patient/login" className="hover:text-primary">دخول المرضى</Link></li>
                  <li><Link href="/login" className="hover:text-primary">دخول العيادات</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-[13px] font-semibold text-slate-900">قانوني</p>
                <ul className="space-y-2.5 text-[13.5px] text-slate-500">
                  <li><Link href="/terms" className="hover:text-primary">شروط الاستخدام</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary">سياسة الخصوصية</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-100 pt-6 text-center text-[13px] text-slate-400 sm:text-right">
            © {new Date().getFullYear()} MBN Health. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
