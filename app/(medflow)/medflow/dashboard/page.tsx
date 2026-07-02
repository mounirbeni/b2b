import {
  CalendarDays, Clock, CheckCircle2, XCircle, Users, UserPlus2,
  ArrowUpRight, Plus, UserPlus, CalendarPlus, Settings as SettingsIcon,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { requireClinicSession } from "@/lib/auth-guard";
import { getClinic, getDashboardData, initialsOf, colorFor } from "@/lib/medflow/live";
import { formatDateArabic } from "@/lib/date-utils";
import { Avatar, SectionCard, StatTile } from "@/components/medflow/ui";
import { BarChart, DonutChart } from "@/components/medflow/charts";
import { RealStatusPill, REAL_STATUS_META } from "@/lib/medflow/real-status";
import type { Status } from "@/types";

const CLINIC_STATUS_MESSAGE: Record<string, string> = {
  PENDING: "عيادتك قيد المراجعة من طرف الإدارة ولن تظهر في الدليل العام حتى تتم الموافقة عليها.",
  REJECTED: "تم رفض عيادتك من طرف الإدارة. تواصل معنا لمزيد من التفاصيل.",
  SUSPENDED: "تم تعليق عيادتك مؤقتاً ولا تظهر حالياً في الدليل العام.",
};

const QUICK_ACTIONS = [
  { label: "New Appointment", href: "/medflow/appointments", icon: <CalendarPlus size={18} />, tone: "primary" as const },
  { label: "Register Patient", href: "/patients/new", icon: <UserPlus size={18} />, tone: "success" as const },
  { label: "Reception Queue", href: "/medflow/reception", icon: <Users size={18} />, tone: "info" as const },
  { label: "Clinic Settings", href: "/settings", icon: <SettingsIcon size={18} />, tone: "warning" as const },
];

const TONE: Record<string, { fg: string; bg: string }> = {
  primary: { fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)" },
  success: { fg: "var(--mf-success)", bg: "var(--mf-success-soft)" },
  warning: { fg: "var(--mf-warning)", bg: "var(--mf-warning-soft)" },
  info: { fg: "var(--mf-info)", bg: "var(--mf-info-soft)" },
};

export default async function DashboardPage() {
  const session = await requireClinicSession();
  const clinicId = session!.user.clinicId;

  const [clinic, data] = await Promise.all([getClinic(clinicId), getDashboardData(clinicId)]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const donutData = (Object.keys(REAL_STATUS_META) as Status[])
    .map((s) => ({ label: REAL_STATUS_META[s].label, v: data.monthByStatus[s], color: REAL_STATUS_META[s].dot }))
    .filter((d) => d.v > 0);
  const monthTotal = donutData.reduce((sum, d) => sum + d.v, 0);

  const activity = [
    ...data.recentPatients.map((p) => ({
      key: `p-${p.id}`,
      text: "New patient registered",
      meta: p.name,
      time: p.createdAt,
      tone: "primary" as const,
      icon: <UserPlus2 size={15} />,
    })),
    ...data.recentAppointments
      .filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED")
      .map((a) => ({
        key: `a-${a.id}`,
        text: a.status === "COMPLETED" ? "Appointment completed for" : "Appointment cancelled for",
        meta: a.patient.name,
        time: a.updatedAt,
        tone: a.status === "COMPLETED" ? ("success" as const) : ("error" as const),
        icon: a.status === "COMPLETED" ? <CheckCircle2 size={15} /> : <XCircle size={15} />,
      })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {clinic && clinic.status !== "APPROVED" && (
        <div
          className="mf-animate-in flex items-center gap-3 rounded-2xl border px-4 py-3"
          style={{ borderColor: "color-mix(in srgb, var(--mf-warning) 35%, var(--mf-border))", background: "var(--mf-warning-soft)" }}
        >
          <AlertTriangle size={18} style={{ color: "var(--mf-warning)" }} />
          <span className="text-[13px]" style={{ color: "var(--mf-text)" }}>
            {CLINIC_STATUS_MESSAGE[clinic.status] ?? clinic.status}
          </span>
        </div>
      )}

      {/* Hero */}
      <div className="mf-animate-in relative overflow-hidden rounded-[24px] p-6 md:p-8" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-hairline)", boxShadow: "var(--mf-shadow-sm)" }}>
        <div className="pointer-events-none absolute inset-0 mf-mesh opacity-70" />
        <div className="pointer-events-none absolute inset-0 mf-fieldgrid opacity-[0.5]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-hairline)", color: "var(--mf-text-2)", boxShadow: "var(--mf-shadow-xs)" }}>
              <span className="mf-dot mf-live" style={{ background: "var(--mf-success)", color: "var(--mf-success)" }} /> {formatDateArabic(new Date())}
            </div>
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.025em] md:text-[34px]" style={{ color: "var(--mf-text)" }}>
              {greeting}, <span className="mf-text-gradient">{(clinic?.name ?? "Clinic").split(" ")[0]}</span>
            </h1>
            <p className="mt-1.5 text-[15px]" style={{ color: "var(--mf-text-2)" }}>
              Here's what's happening across your clinic today.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            {/* live micro-metrics */}
            <div className="flex items-center gap-2.5">
              {[
                { n: data.counts.waiting, l: "Waiting", c: "var(--mf-warning)" },
                { n: data.counts.inConsultation, l: "In room", c: "var(--mf-primary)" },
                { n: data.counts.completed, l: "Done", c: "var(--mf-success)" },
              ].map((m) => (
                <div key={m.l} className="rounded-2xl px-3.5 py-2.5 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-hairline)", boxShadow: "var(--mf-shadow-xs)", minWidth: 72 }}>
                  <p className="text-[20px] font-bold leading-none mf-nums" style={{ color: m.c }}>{m.n}</p>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: "var(--mf-text-3)" }}>{m.l}</p>
                </div>
              ))}
            </div>
            <a href="/medflow/appointments" className="mf-btn mf-btn-primary shrink-0"><Plus size={16} /> New Appointment</a>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="mf-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Today's Appointments" value={String(data.counts.todayTotal)} tone="primary" icon={<CalendarDays size={18} />} />
        <StatTile label="Patients Waiting" value={String(data.counts.waiting)} tone="warning" icon={<Clock size={18} />} />
        <StatTile label="In Consultation" value={String(data.counts.inConsultation)} tone="info" icon={<Users size={18} />} />
        <StatTile label="Completed Today" value={String(data.counts.completed)} tone="success" icon={<CheckCircle2 size={18} />} />
        <StatTile label="Cancelled Today" value={String(data.counts.cancelled)} tone="error" icon={<XCircle size={18} />} />
        <StatTile label="No-show Today" value={String(data.counts.noShow)} tone="warning" icon={<AlertTriangle size={18} />} />
        <StatTile label="Total Patients" value={data.counts.totalPatients.toLocaleString()} tone="primary" icon={<Users size={18} />} />
        <StatTile label="New Patients This Month" value={String(data.counts.newPatientsThisMonth)} tone="success" icon={<UserPlus2 size={18} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Appointment Trends" subtitle="Bookings for the last 7 days" className="lg:col-span-2">
          <BarChart data={data.trend} color="var(--mf-primary)" />
        </SectionCard>

        <SectionCard title="Appointments by Status" subtitle="This month">
          {monthTotal > 0 ? (
            <DonutChart data={donutData} centerLabel={String(monthTotal)} centerSub="appointments" />
          ) : (
            <p className="py-10 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No appointments this month yet.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Patient Growth" subtitle="New patients registered · last 6 weeks">
        <BarChart data={data.growth} color="var(--mf-secondary)" />
      </SectionCard>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {QUICK_ACTIONS.map((q) => {
          const t = TONE[q.tone];
          return (
            <a key={q.label} href={q.href} className="mf-card mf-card-hover flex items-center gap-3 p-4 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ color: t.fg, background: t.bg }}>{q.icon}</span>
              <span className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{q.label}</span>
              <ArrowUpRight size={16} className="ml-auto" style={{ color: "var(--mf-text-3)" }} />
            </a>
          );
        })}
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Today's Appointments"
          subtitle="All patients scheduled today"
          action={<a href="/medflow/appointments" className="mf-btn mf-btn-ghost mf-btn-sm">View all <ChevronRight size={15} /></a>}
          bodyClassName="px-0 pb-0"
        >
          {data.todayAppointments.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No appointments scheduled for today.</p>
          ) : (
            data.todayAppointments.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center gap-3 border-t px-5 py-3 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                <Avatar initials={initialsOf(a.patient.name)} color={colorFor(a.patientId)} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{a.patient.name}</p>
                  <p className="truncate text-[12px]" style={{ color: "var(--mf-text-2)" }}>{a.type} · {a.duration} min</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-semibold mf-nums" style={{ color: "var(--mf-text)" }}>
                    {a.dateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <RealStatusPill status={a.status as Status} live={a.status === "IN_PROGRESS"} />
              </div>
            ))
          )}
        </SectionCard>

        <SectionCard title="Recent Activity" bodyClassName="px-0 pb-2">
          {activity.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No recent activity yet.</p>
          ) : (
            <div className="px-5">
              <div className="relative space-y-4 border-l pl-5" style={{ borderColor: "var(--mf-border)" }}>
                {activity.map((ac) => {
                  const t = TONE[ac.tone];
                  return (
                    <div key={ac.key} className="relative">
                      <span className="absolute -left-[27px] top-0 flex h-6 w-6 items-center justify-center rounded-full" style={{ color: t.fg, background: t.bg, boxShadow: "0 0 0 3px var(--mf-surface)" }}>
                        {ac.icon}
                      </span>
                      <p className="text-[13px] leading-snug" style={{ color: "var(--mf-text-2)" }}>
                        {ac.text} <b style={{ color: "var(--mf-text)" }}>{ac.meta}</b>
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>{formatDateArabic(ac.time)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
