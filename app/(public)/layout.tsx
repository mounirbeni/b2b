import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isPatient = session?.user?.role === "patient";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <Link href="/search" className="text-lg font-bold text-primary">
          دليل العيادات
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {isPatient ? (
            <Link href="/patient/appointments" className="text-slate-600 hover:text-primary">
              حجوزاتي
            </Link>
          ) : (
            <Link href="/patient/login" className="text-slate-600 hover:text-primary">
              تسجيل دخول المرضى
            </Link>
          )}
          <Link href="/login" className="text-slate-600 hover:text-primary">
            تسجيل دخول العيادات
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
    </div>
  );
}
