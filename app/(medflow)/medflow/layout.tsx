import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../medflow.css";
import { Shell } from "@/components/medflow/shell";
import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "MedFlow AI — Premium Clinic OS",
  description: "A world-class, enterprise-grade clinic management platform.",
};

export default async function MedFlowLayout({ children }: { children: React.ReactNode }) {
  const session = await requireClinicSession();
  if (!session) {
    redirect("/login");
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const [clinic, todayCount, waitingCount] = await Promise.all([
    prisma.clinic.findUnique({ where: { id: session.user.clinicId }, select: { name: true } }),
    prisma.appointment.count({ where: { clinicId: session.user.clinicId, dateTime: { gte: start, lte: end } } }),
    prisma.appointment.count({
      where: {
        clinicId: session.user.clinicId,
        dateTime: { gte: start, lte: end },
        status: { in: ["WAITING", "CONFIRMED"] },
      },
    }),
  ]);

  return (
    <Shell
      clinicName={clinic?.name ?? session.user.clinicName ?? "Clinic"}
      userName={session.user.name ?? "User"}
      todayCount={todayCount}
      waitingCount={waitingCount}
    >
      {children}
    </Shell>
  );
}
