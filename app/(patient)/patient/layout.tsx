import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PatientHeader } from "@/components/layout/patient-header";

export default async function PatientAreaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "patient") {
    redirect("/patient/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientHeader userName={session.user.name ?? "حسابي"} />
      <main className="mx-auto max-w-3xl p-4 md:p-6">{children}</main>
    </div>
  );
}
