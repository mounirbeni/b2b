import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <span className="text-lg font-bold text-primary">لوحة إدارة المنصة</span>
        <AdminSignOutButton />
      </header>
      <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">{children}</main>
    </div>
  );
}
