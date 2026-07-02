import { CalendarRange } from "lucide-react";
import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, SectionCard } from "@/components/medflow/ui";
import { RealStatusPill } from "@/lib/medflow/real-status";
import type { Status } from "@/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function CalendarPage() {
  const session = await requireClinicSession();
  const clinicId = session!.user.clinicId;
  const now = new Date();

  const monthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
  const gridStart = startOfWeek(monthFirst);
  const gridEnd = new Date(gridStart);
  gridEnd.setDate(gridEnd.getDate() + 42);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [monthAppointments, todayAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: { clinicId, dateTime: { gte: gridStart, lt: gridEnd } },
      select: { id: true, dateTime: true, status: true },
    }),
    prisma.appointment.findMany({
      where: { clinicId, dateTime: { gte: todayStart, lte: todayEnd } },
      include: { patient: true },
      orderBy: { dateTime: "asc" },
    }),
  ]);

  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    const inMonth = d.getMonth() === now.getMonth();
    const count = monthAppointments.filter((a) => a.dateTime.toDateString() === d.toDateString()).length;
    return { date: d, inMonth, count, isToday: d.toDateString() === now.toDateString() };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" subtitle="Your clinic's schedule at a glance" icon={<CalendarRange size={20} />} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="mf-card p-5">
          <h3 className="mb-4 text-[18px] font-bold" style={{ color: "var(--mf-text)" }}>
            {now.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((d) => <div key={d} className="pb-1 text-center text-[11px] font-semibold uppercase" style={{ color: "var(--mf-text-3)" }}>{d}</div>)}
            {cells.map((cell, i) => (
              <div key={i} className="flex aspect-square flex-col rounded-xl border p-2" style={{ borderColor: cell.isToday ? "var(--mf-primary)" : "var(--mf-border)", background: cell.isToday ? "var(--mf-primary-soft)" : "var(--mf-surface)" }}>
                <span className="text-[13px] font-semibold mf-nums" style={{ color: cell.isToday ? "var(--mf-primary)" : cell.inMonth ? "var(--mf-text)" : "var(--mf-text-3)" }}>{cell.date.getDate()}</span>
                {cell.inMonth && cell.count > 0 && (
                  <span className="mt-auto self-start rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}>{cell.count}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <SectionCard title="Today's Schedule" bodyClassName="space-y-2.5">
          {todayAppointments.length === 0 ? (
            <p className="py-6 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No appointments today.</p>
          ) : (
            todayAppointments.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-[12px] font-semibold mf-nums" style={{ color: "var(--mf-primary)", width: 42 }}>
                  {a.dateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{a.patient.name}</p>
                  <p className="truncate text-[11px]" style={{ color: "var(--mf-text-2)" }}>{a.type}</p>
                </div>
                <RealStatusPill status={a.status as Status} />
              </div>
            ))
          )}
        </SectionCard>
      </div>
    </div>
  );
}
