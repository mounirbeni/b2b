import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { BrandLogo } from "@/components/brand-logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <BrandLogo href={null} />
          <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 sm:inline">لوحة الإدارة</span>
        </div>
        <AdminSignOutButton />
      </header>
      <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">{children}</main>
    </div>
  );
}
