import { ConciergeBell, Clock, CheckCircle2, Activity, Users } from "lucide-react";
import { requireClinicSession } from "@/lib/auth-guard";
import { getReceptionQueue, initialsOf, colorFor } from "@/lib/medflow/live";
import { prisma } from "@/lib/prisma";
import { StatTile, PageHeader } from "@/components/medflow/ui";
import { ReceptionQueue } from "@/components/medflow/reception-queue";

export default async function ReceptionPage() {
  const session = await requireClinicSession();
  const clinicId = session!.user.clinicId;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const [queueRaw, completedToday] = await Promise.all([
    getReceptionQueue(clinicId),
    prisma.appointment.count({ where: { clinicId, dateTime: { gte: start, lte: end }, status: "COMPLETED" } }),
  ]);

  const queue = JSON.parse(JSON.stringify(queueRaw));
  const waiting = queueRaw.filter((a) => a.status === "WAITING" || a.status === "CONFIRMED" || a.status === "SCHEDULED").length;
  const inConsultation = queueRaw.filter((a) => a.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Reception" subtitle="Today's queue — everything in one screen" icon={<ConciergeBell size={20} />} />

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Waiting" value={String(waiting)} icon={<Clock size={18} />} tone="warning" />
        <StatTile label="Checked-in Today" value={String(queueRaw.length)} icon={<Users size={18} />} tone="primary" />
        <StatTile label="In Consultation" value={String(inConsultation)} icon={<Activity size={18} />} tone="info" />
        <StatTile label="Completed Today" value={String(completedToday)} icon={<CheckCircle2 size={18} />} tone="success" />
      </div>

      <ReceptionQueue initialQueue={queue} />
    </div>
  );
}
