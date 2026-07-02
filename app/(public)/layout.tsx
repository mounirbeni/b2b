import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <Link href="/search" className="text-lg font-bold text-primary">
          دليل العيادات
        </Link>
        <Link href="/login" className="text-sm text-slate-600 hover:text-primary">
          تسجيل دخول العيادات
        </Link>
      </header>
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
    </div>
  );
}
