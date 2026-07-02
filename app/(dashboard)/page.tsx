import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DailySchedule } from "@/components/dashboard/daily-schedule";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { formatDateArabic } from "@/lib/date-utils";
import type { AppointmentWithPatient } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  const clinicId = session!.user.clinicId;

  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: { clinicId, dateTime: { gte: start, lte: end } },
    include: { patient: true, reminders: true },
    orderBy: { dateTime: "asc" },
  });

  const initialAppointments = JSON.parse(JSON.stringify(appointments)) as AppointmentWithPatient[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{session!.user.clinicName ?? "عيادتي"}</h1>
          <p className="text-sm text-muted-foreground">{formatDateArabic(now)}</p>
        </div>
        <DashboardStats initialAppointments={initialAppointments} dateKey={dateKey} />
      </div>

      <DailySchedule initialAppointments={initialAppointments} dateKey={dateKey} />
    </div>
  );
}
