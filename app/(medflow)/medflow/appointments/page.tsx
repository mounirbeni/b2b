import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { AppointmentsBoard } from "@/components/medflow/appointments-board";

export default async function AppointmentsPage() {
  const session = await requireClinicSession();
  const clinicId = session!.user.clinicId;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: { clinicId, dateTime: { gte: monthStart, lte: monthEnd } },
    include: { patient: true },
    orderBy: { dateTime: "asc" },
  });

  const initial = JSON.parse(JSON.stringify(appointments));

  return <AppointmentsBoard initialAppointments={initial} rangeFrom={monthStart.toISOString()} rangeTo={monthEnd.toISOString()} />;
}
