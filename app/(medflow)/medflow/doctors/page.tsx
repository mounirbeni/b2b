import {
  Stethoscope, Plus, Star, Users, Clock, Search, Calendar, TrendingUp, Award,
} from "lucide-react";
import { doctors } from "@/lib/medflow/data";
import { Avatar, StatTile, PageHeader, Pill, ProgressBar, SectionCard } from "@/components/medflow/ui";
import { RadialGauge } from "@/components/medflow/charts";

const STATS = [
  { label: "Active Doctors", value: "24", icon: <Stethoscope size={18} />, tone: "primary", delta: 4.2 },
  { label: "Avg. Satisfaction", value: "4.8", icon: <Star size={18} />, tone: "warning", delta: 2.1 },
  { label: "Consults This Week", value: "612", icon: <Users size={18} />, tone: "success", delta: 9.7 },
  { label: "Avg. Utilization", value: "76%", icon: <TrendingUp size={18} />, tone: "info", delta: 5.3 },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Doctors" subtitle="Directory, availability and performance analytics" icon={<Stethoscope size={20} />}>
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
          <input className="mf-input pl-9" placeholder="Search doctors…" style={{ width: 200 }} />
        </div>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> Add Doctor</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatTile key={s.label} {...s} tone={s.tone as any} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((d) => (
          <div key={d.id} className="mf-card mf-card-hover p-5">
            <div className="flex items-start gap-3.5">
              <Avatar initials={d.avatar} color={d.color} size={52} online={d.online} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold" style={{ color: "var(--mf-text)" }}>{d.name}</p>
                <p className="text-[13px]" style={{ color: "var(--mf-text-2)" }}>{d.specialty}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Pill tone={d.online ? "success" : "neutral"} dot>{d.online ? "Available" : "Off duty"}</Pill>
                  <span className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--mf-warning)" }}><Star size={12} fill="currentColor" /> {d.rating}</span>
                </div>
              </div>
              <RadialGauge value={d.utilization} size={54} thickness={6} color={d.color} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-2.5" style={{ borderColor: "var(--mf-border)" }}>
                <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>Patients today</p>
                <p className="text-[17px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{d.patientsToday}</p>
              </div>
              <div className="rounded-xl border p-2.5" style={{ borderColor: "var(--mf-border)" }}>
                <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>Room</p>
                <p className="text-[17px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{d.room}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>This week</p>
              <div className="flex items-center justify-between gap-1.5">
                {DAYS.map((day, i) => {
                  const on = i < 5;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="h-8 w-full rounded-md" style={{ background: on ? `color-mix(in srgb, ${d.color} ${40 + i * 8}%, transparent)` : "var(--mf-surface-hover)" }} />
                      <span className="text-[10px]" style={{ color: "var(--mf-text-3)" }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
