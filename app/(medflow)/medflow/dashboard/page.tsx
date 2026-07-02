import {
  CalendarDays, Clock, Stethoscope, CheckCircle2, DollarSign, TrendingUp, XCircle,
  Hourglass, ArrowUpRight, Plus, UserPlus, CalendarPlus, Receipt, FlaskConical,
  Pill, CreditCard, UserCircle2, Activity, ChevronRight, Sparkles,
} from "lucide-react";
import {
  kpis, appointments, activities, doctors, revenueSeries, apptTrend, patientGrowth, doctorShare,
} from "@/lib/medflow/data";
import { Avatar, Card, SectionCard, StatTile, StatusPill, Pill as Chip, ProgressBar } from "@/components/medflow/ui";
import { AreaChart, BarChart, DonutChart, Sparkline } from "@/components/medflow/charts";

const KPI_ICON: Record<string, React.ReactNode> = {
  calendar: <CalendarDays size={18} />, clock: <Clock size={18} />, stethoscope: <Stethoscope size={18} />,
  check: <CheckCircle2 size={18} />, dollar: <DollarSign size={18} />, trend: <TrendingUp size={18} />,
  x: <XCircle size={18} />, hourglass: <Hourglass size={18} />,
};
const SPARK_COLOR: Record<string, string> = {
  primary: "var(--mf-primary)", success: "var(--mf-success)", warning: "var(--mf-warning)", error: "var(--mf-error)", info: "var(--mf-info)",
};
const ACT_ICON: Record<string, React.ReactNode> = {
  check: <CheckCircle2 size={15} />, user: <UserPlus size={15} />, flask: <FlaskConical size={15} />,
  card: <CreditCard size={15} />, x: <XCircle size={15} />, pill: <Pill size={15} />,
};
const ACT_TONE: Record<string, { fg: string; bg: string }> = {
  primary: { fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)" },
  success: { fg: "var(--mf-success)", bg: "var(--mf-success-soft)" },
  warning: { fg: "var(--mf-warning)", bg: "var(--mf-warning-soft)" },
  error: { fg: "var(--mf-error)", bg: "var(--mf-error-soft)" },
  info: { fg: "var(--mf-info)", bg: "var(--mf-info-soft)" },
};

const QUICK_ACTIONS = [
  { label: "New Appointment", icon: <CalendarPlus size={18} />, tone: "primary" },
  { label: "Register Patient", icon: <UserPlus size={18} />, tone: "success" },
  { label: "Create Invoice", icon: <Receipt size={18} />, tone: "info" },
  { label: "Walk-in Check-in", icon: <UserCircle2 size={18} />, tone: "warning" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="mf-animate-in relative overflow-hidden rounded-3xl border p-6 md:p-7" style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)" }}>
        <div className="absolute inset-0 mf-mesh" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}>
              <span className="mf-dot" style={{ background: "var(--mf-success)" }} /> Thursday, July 2 · 2026
            </div>
            <h1 className="text-[26px] font-bold tracking-tight md:text-[30px]" style={{ color: "var(--mf-text)" }}>
              Good morning, Riverside Medical 👋
            </h1>
            <p className="mt-1 text-[15px]" style={{ color: "var(--mf-text-2)" }}>
              You have <b style={{ color: "var(--mf-text)" }}>38 appointments</b> today · 6 patients waiting · 4 in consultation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button className="mf-btn mf-btn-outline"><Sparkles size={16} style={{ color: "var(--mf-primary)" }} /> AI Daily Brief</button>
            <button className="mf-btn mf-btn-primary"><Plus size={16} /> New Appointment</button>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="mf-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <StatTile
            key={k.key}
            label={k.label}
            value={k.value}
            tone={k.tone as any}
            delta={k.delta}
            invertDelta={k.key === "wait" || k.key === "cancelled"}
            icon={KPI_ICON[k.icon]}
            spark={<Sparkline data={k.spark} color={SPARK_COLOR[k.tone]} width={92} height={34} />}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Revenue Analytics"
          subtitle="Revenue vs. profit · last 6 months"
          action={
            <div className="flex items-center gap-3 text-[12px]">
              <span className="flex items-center gap-1.5" style={{ color: "var(--mf-text-2)" }}><span className="mf-dot" style={{ background: "var(--mf-c1)" }} /> Revenue</span>
              <span className="flex items-center gap-1.5" style={{ color: "var(--mf-text-2)" }}><span className="mf-dot" style={{ background: "var(--mf-c2)" }} /> Profit</span>
            </div>
          }
        >
          <AreaChart data={revenueSeries} />
        </SectionCard>

        <SectionCard title="Most Visited Doctors" subtitle="Share of visits this month">
          <DonutChart data={doctorShare} centerLabel="1,284" centerSub="visits" />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Appointment Trends" subtitle="Bookings by day of week" action={<Chip tone="success" dot>+18% WoW</Chip>}>
          <BarChart data={apptTrend} color="var(--mf-primary)" />
        </SectionCard>
        <SectionCard title="Patient Growth" subtitle="New patients · last 6 weeks" action={<Chip tone="primary" dot>+118 total</Chip>}>
          <BarChart data={patientGrowth} color="var(--mf-secondary)" />
        </SectionCard>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {QUICK_ACTIONS.map((q) => {
          const t = ACT_TONE[q.tone];
          return (
            <button key={q.label} className="mf-card mf-card-hover flex items-center gap-3 p-4 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ color: t.fg, background: t.bg }}>{q.icon}</span>
              <span className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{q.label}</span>
              <ArrowUpRight size={16} className="ml-auto" style={{ color: "var(--mf-text-3)" }} />
            </button>
          );
        })}
      </div>

      {/* Bottom three columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <SectionCard
          className="lg:col-span-2"
          title="Upcoming Appointments"
          subtitle="Next patients in the queue"
          action={<a href="/medflow/appointments" className="mf-btn mf-btn-ghost mf-btn-sm">View all <ChevronRight size={15} /></a>}
          bodyClassName="px-0 pb-0"
        >
          <div>
            {appointments.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 border-t px-5 py-3 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                <Avatar initials={a.patientAvatar} color={a.patientColor} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{a.patient}</p>
                  <p className="truncate text-[12px]" style={{ color: "var(--mf-text-2)" }}>{a.doctor} · {a.department} · Room {a.room}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-semibold mf-nums" style={{ color: "var(--mf-text)" }}>{a.start}</p>
                  <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>{a.durationMin} min · {a.type}</p>
                </div>
                <StatusPill status={a.status} live={a.status === "in-consultation"} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Right rail: activity + doctor availability */}
        <div className="space-y-6">
          <SectionCard title="Recent Activity" bodyClassName="px-0 pb-2">
            <div className="px-5">
              <div className="relative space-y-4 border-l pl-5" style={{ borderColor: "var(--mf-border)" }}>
                {activities.slice(0, 5).map((ac) => {
                  const t = ACT_TONE[ac.tone];
                  return (
                    <div key={ac.id} className="relative">
                      <span className="absolute -left-[27px] top-0 flex h-6 w-6 items-center justify-center rounded-full" style={{ color: t.fg, background: t.bg, boxShadow: "0 0 0 3px var(--mf-surface)" }}>
                        {ACT_ICON[ac.icon]}
                      </span>
                      <p className="text-[13px] leading-snug" style={{ color: "var(--mf-text-2)" }}>
                        {ac.text} <b style={{ color: "var(--mf-text)" }}>{ac.meta}</b>
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>{ac.time}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Doctor Availability" bodyClassName="space-y-3">
            {doctors.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <Avatar initials={d.avatar} color={d.color} size={34} online={d.online} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{d.name}</p>
                  <div className="mt-1"><ProgressBar value={d.utilization} color={d.color} /></div>
                </div>
                <span className="text-[12px] font-semibold mf-nums" style={{ color: "var(--mf-text-2)" }}>{d.utilization}%</span>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
