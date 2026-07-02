import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isPatient = session?.user?.role === "patient";
  const isClinic = session?.user?.role === "clinic";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          دليل العيادات
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" className="hidden text-slate-600 hover:text-primary sm:inline">
            ابحث عن عيادة
          </Link>
          {isPatient ? (
            <Link href="/patient/appointments" className="text-slate-600 hover:text-primary">
              حجوزاتي
            </Link>
          ) : (
            <Link href="/patient/login" className="text-slate-600 hover:text-primary">
              تسجيل دخول المرضى
            </Link>
          )}
          {isClinic ? (
            <Link href="/medflow/dashboard" className="text-slate-600 hover:text-primary">
              لوحة تحكم العيادة
            </Link>
          ) : (
            <Link href="/login" className="text-slate-600 hover:text-primary">
              تسجيل دخول العيادات
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
      <footer className="border-t bg-white py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} دليل العيادات</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-primary">
              شروط الاستخدام
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              سياسة الخصوصية
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
