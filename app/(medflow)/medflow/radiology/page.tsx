import { Scan, Plus, Upload, Brain, Bone, Waves, Activity, Search, MessageSquare } from "lucide-react";
import { PageHeader, SectionCard, StatTile, Avatar, Pill, DemoBanner } from "@/components/medflow/ui";

const MODALITIES = [
  { label: "MRI", icon: <Brain size={20} />, count: 6, tone: "var(--mf-primary)" },
  { label: "CT Scan", icon: <Activity size={20} />, count: 4, tone: "var(--mf-info)" },
  { label: "X-Ray", icon: <Bone size={20} />, count: 12, tone: "var(--mf-secondary)" },
  { label: "Ultrasound", icon: <Waves size={20} />, count: 8, tone: "var(--mf-c4)" },
];

const REQUESTS = [
  { id: "RAD-330", patient: "Robert Klein", av: "RK", c: "#f59e0b", study: "Knee MRI — Right", status: "Completed", tone: "success" as const },
  { id: "RAD-331", patient: "James Sullivan", av: "JS", c: "#10b981", study: "Chest CT", status: "In Progress", tone: "info" as const },
  { id: "RAD-332", patient: "Frank Miller", av: "FM", c: "#ef4444", study: "Chest X-Ray", status: "Pending", tone: "warning" as const },
  { id: "RAD-333", patient: "Maria Gonzalez", av: "MG", c: "#ec4899", study: "Abdominal Ultrasound", status: "Pending", tone: "warning" as const },
];

export default function RadiologyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Radiology" subtitle="Imaging requests, studies & radiologist reports" icon={<Scan size={20} />}>
        <button className="mf-btn mf-btn-outline"><Upload size={16} /> Upload Study</button>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> New Request</button>
      </PageHeader>

      <DemoBanner feature="Radiology imaging requests" />

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MODALITIES.map((m) => (
          <div key={m.label} className="mf-card mf-card-hover p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ color: m.tone, background: `color-mix(in srgb, ${m.tone} 14%, transparent)` }}>{m.icon}</span>
              <span className="text-[26px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{m.count}</span>
            </div>
            <p className="mt-2 text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{m.label}</p>
            <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>Active studies</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Imaging Requests" bodyClassName="px-0 pb-0">
          {REQUESTS.map((r) => (
            <div key={r.id} className="flex items-center gap-3 border-t px-5 py-3.5 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
              <span className="text-[12px] font-semibold mf-nums" style={{ color: "var(--mf-primary)" }}>{r.id}</span>
              <Avatar initials={r.av} color={r.c} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{r.patient}</p>
                <p className="truncate text-[12px]" style={{ color: "var(--mf-text-2)" }}>{r.study}</p>
              </div>
              <Pill tone={r.tone} dot>{r.status}</Pill>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Viewer" subtitle="Knee MRI — Robert Klein">
          <div className="relative aspect-square overflow-hidden rounded-2xl border" style={{ borderColor: "var(--mf-border)", background: "#0b0f19" }}>
            <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 50% 45%, #334155, #0b0f19 70%)" }} />
            <Bone size={72} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" style={{ color: "#94a3b8" }} />
            <div className="absolute left-3 top-3 text-[11px] font-mono" style={{ color: "#64748b" }}>SLICE 24/48</div>
            <div className="absolute bottom-3 right-3 text-[11px] font-mono" style={{ color: "#64748b" }}>T2 · 1.5T</div>
          </div>
          <button className="mf-btn mf-btn-outline mt-3 w-full"><MessageSquare size={15} /> Radiologist Notes</button>
        </SectionCard>
      </div>
    </div>
  );
}
