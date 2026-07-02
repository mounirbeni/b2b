import {
  ConciergeBell, UserPlus, Zap, Clock, CheckCircle2, Users, Activity, ArrowRight,
  Phone, Play, AlertTriangle, CalendarPlus, Search,
} from "lucide-react";
import { queue, doctors } from "@/lib/medflow/data";
import { Avatar, Card, SectionCard, StatTile, PageHeader, StatusPill, Pill, ProgressBar } from "@/components/medflow/ui";

const STATS = [
  { label: "Waiting", value: "6", icon: <Clock size={18} />, tone: "warning", delta: -8 },
  { label: "Checked-in", value: "14", icon: <Users size={18} />, tone: "primary", delta: 12 },
  { label: "In Consultation", value: "4", icon: <Activity size={18} />, tone: "info", delta: 5 },
  { label: "Completed Today", value: "24", icon: <CheckCircle2 size={18} />, tone: "success", delta: 18 },
];

export default function ReceptionPage() {
  const emergency = queue.filter((q) => q.priority === "emergency");
  const normal = queue.filter((q) => q.priority !== "emergency");

  return (
    <div className="space-y-6">
      <PageHeader title="Reception" subtitle="Front desk command center — everything in one screen" icon={<ConciergeBell size={20} />}>
        <button className="mf-btn mf-btn-outline"><CalendarPlus size={16} /> Instant Booking</button>
        <button className="mf-btn mf-btn-primary"><UserPlus size={16} /> Walk-in Register</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone as any} delta={s.delta} invertDelta={s.label === "Waiting"} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Queue */}
        <div className="space-y-6 lg:col-span-2">
          {/* Emergency */}
          <div className="mf-card overflow-hidden p-0" style={{ borderColor: "color-mix(in srgb, var(--mf-error) 40%, var(--mf-border))" }}>
            <div className="flex items-center gap-2 px-5 py-3.5" style={{ background: "var(--mf-error-soft)" }}>
              <AlertTriangle size={17} style={{ color: "var(--mf-error)" }} />
              <span className="text-[14px] font-bold" style={{ color: "var(--mf-error)" }}>Emergency Queue</span>
              <span className="mf-chip ml-auto" style={{ background: "var(--mf-error)", color: "#fff" }}>{emergency.length} active</span>
            </div>
            {emergency.map((q) => (
              <div key={q.id} className="flex items-center gap-3 border-t px-5 py-3" style={{ borderColor: "var(--mf-border-soft)" }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-bold" style={{ background: "var(--mf-error)", color: "#fff" }}>{q.token}</span>
                <Avatar initials={q.avatar} color={q.color} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{q.name}</p>
                  <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>Assigned to {q.doctor}</p>
                </div>
                <button className="mf-btn mf-btn-sm" style={{ background: "var(--mf-error)", color: "#fff" }}><Play size={14} /> Admit Now</button>
              </div>
            ))}
          </div>

          {/* Waiting queue */}
          <SectionCard
            title="Waiting Queue"
            subtitle="Ordered by arrival · estimated wait times"
            action={
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
                <input className="mf-input mf-btn-sm h-8 pl-8 text-[13px]" placeholder="Find patient…" style={{ width: 160 }} />
              </div>
            }
            bodyClassName="px-0 pb-0"
          >
            {normal.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 border-t px-5 py-3 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-bold" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}>{q.token}</span>
                <Avatar initials={q.avatar} color={q.color} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{q.name}</p>
                  <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{q.doctor}</p>
                </div>
                {q.status === "in-consultation" ? (
                  <StatusPill status="in-consultation" live />
                ) : (
                  <>
                    <div className="hidden text-right sm:block">
                      <p className="text-[13px] font-semibold mf-nums" style={{ color: "var(--mf-warning)" }}>~{q.wait} min</p>
                      <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>est. wait</p>
                    </div>
                    <button className="mf-btn mf-btn-outline mf-btn-icon"><Phone size={15} /></button>
                    <button className="mf-btn mf-btn-primary mf-btn-sm"><ArrowRight size={14} /> Call</button>
                  </>
                )}
              </div>
            ))}
          </SectionCard>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Quick registration */}
          <SectionCard title="Quick Registration" subtitle="Register a walk-in in seconds">
            <div className="space-y-3">
              <input className="mf-input" placeholder="Full name" />
              <input className="mf-input" placeholder="Phone number" />
              <div className="grid grid-cols-2 gap-3">
                <input className="mf-input" placeholder="Age" />
                <select className="mf-input" defaultValue=""><option value="" disabled>Gender</option><option>Male</option><option>Female</option></select>
              </div>
              <select className="mf-input" defaultValue=""><option value="" disabled>Assign doctor</option>{doctors.map((d) => <option key={d.id}>{d.name}</option>)}</select>
              <button className="mf-btn mf-btn-primary w-full"><Zap size={16} /> Register & Add to Queue</button>
            </div>
          </SectionCard>

          {/* Est wait times */}
          <SectionCard title="Estimated Waiting Time" bodyClassName="space-y-3.5">
            {doctors.slice(0, 4).map((d) => {
              const wait = [5, 12, 20, 8][doctors.indexOf(d) % 4];
              return (
                <div key={d.id}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 font-medium" style={{ color: "var(--mf-text)" }}>
                      <Avatar initials={d.avatar} color={d.color} size={22} /> {d.name.replace("Dr. ", "Dr ")}
                    </span>
                    <span className="font-semibold mf-nums" style={{ color: wait > 15 ? "var(--mf-warning)" : "var(--mf-success)" }}>~{wait}m</span>
                  </div>
                  <ProgressBar value={Math.min(wait * 4, 100)} color={wait > 15 ? "var(--mf-warning)" : "var(--mf-success)"} />
                </div>
              );
            })}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
