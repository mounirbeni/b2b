import { CalendarRange, Plus, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { appointments, doctors } from "@/lib/medflow/data";
import { PageHeader, SectionCard, Avatar, StatusPill, Pill } from "@/components/medflow/ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COUNTS = [0, 2, 4, 3, 6, 5, 8, 3, 2, 7, 4, 5, 3, 6, 8, 4, 2, 5, 3, 7, 4, 6, 2, 3, 5, 8, 4, 3, 6, 2, 4];

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" subtitle="Unified clinic calendar across all providers" icon={<CalendarRange size={20} />}>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> New Event</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="mf-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-bold" style={{ color: "var(--mf-text)" }}>July 2026</h3>
            <div className="flex items-center gap-1">
              <button className="mf-btn mf-btn-outline mf-btn-icon"><ChevronLeft size={16} /></button>
              <button className="mf-btn mf-btn-outline mf-btn-sm">Today</button>
              <button className="mf-btn mf-btn-outline mf-btn-icon"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((d) => <div key={d} className="pb-1 text-center text-[11px] font-semibold uppercase" style={{ color: "var(--mf-text-3)" }}>{d}</div>)}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 1;
              const inMonth = day >= 1 && day <= 31;
              const isToday = day === 2;
              const count = inMonth ? COUNTS[day - 1] : 0;
              return (
                <div key={i} className="flex aspect-square flex-col rounded-xl border p-2 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: isToday ? "var(--mf-primary)" : "var(--mf-border)", background: isToday ? "var(--mf-primary-soft)" : "var(--mf-surface)" }}>
                  <span className="text-[13px] font-semibold mf-nums" style={{ color: isToday ? "var(--mf-primary)" : inMonth ? "var(--mf-text)" : "var(--mf-text-3)" }}>{inMonth ? day : ""}</span>
                  {count > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1">
                      {Array.from({ length: Math.min(count, 4) }).map((_, k) => <span key={k} className="h-1.5 w-1.5 rounded-full" style={{ background: ["var(--mf-c1)", "var(--mf-c2)", "var(--mf-c3)", "var(--mf-c4)"][k] }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard title="Today's Schedule" bodyClassName="space-y-2.5">
            {appointments.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-[12px] font-semibold mf-nums" style={{ color: "var(--mf-primary)", width: 42 }}>{a.start}</span>
                <span className="h-8 w-0.5 rounded-full" style={{ background: a.patientColor }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{a.patient}</p>
                  <p className="truncate text-[11px]" style={{ color: "var(--mf-text-2)" }}>{a.type} · {a.doctor.replace("Dr. ", "Dr ")}</p>
                </div>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Providers" bodyClassName="space-y-2.5">
            {doctors.slice(0, 5).map((d) => (
              <label key={d.id} className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-md" style={{ background: d.color }} />
                <span className="flex-1 text-[13px]" style={{ color: "var(--mf-text)" }}>{d.name.replace("Dr. ", "Dr ")}</span>
                <Pill tone={d.online ? "success" : "neutral"}>{d.online ? "On" : "Off"}</Pill>
              </label>
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
