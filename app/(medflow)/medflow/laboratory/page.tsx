import {
  FlaskConical, Plus, Search, Clock, CheckCircle2, Activity, Upload, MessageSquare, Filter,
} from "lucide-react";
import { labRequests } from "@/lib/medflow/data";
import { Avatar, StatTile, PageHeader, Pill, SectionCard } from "@/components/medflow/ui";

const STATS = [
  { label: "Pending Tests", value: "18", icon: <Clock size={18} />, tone: "warning", delta: -4 },
  { label: "In Progress", value: "7", icon: <Activity size={18} />, tone: "info", delta: 2 },
  { label: "Completed Today", value: "42", icon: <CheckCircle2 size={18} />, tone: "success", delta: 16 },
  { label: "STAT / Urgent", value: "3", icon: <FlaskConical size={18} />, tone: "error", delta: 0 },
];

const STATUS_TONE: Record<string, "success" | "warning" | "info" | "neutral"> = {
  Completed: "success", "In Progress": "info", Pending: "warning",
};

const AV: Record<string, { a: string; c: string }> = {
  "James Sullivan": { a: "JS", c: "#10b981" }, "Elena Fisher": { a: "EF", c: "#2563eb" },
  "Frank Miller": { a: "FM", c: "#ef4444" }, "Maria Gonzalez": { a: "MG", c: "#ec4899" },
};

export default function LaboratoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Laboratory" subtitle="Test requests, results and reference ranges" icon={<FlaskConical size={20} />}>
        <button className="mf-btn mf-btn-outline"><Upload size={16} /> Upload Report</button>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> New Request</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatTile key={s.label} {...s} tone={s.tone as any} invertDelta={s.label !== "Completed Today"} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="mf-card overflow-hidden p-0 lg:col-span-2">
          <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: "var(--mf-border)" }}>
            <p className="text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>Test Requests</p>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} /><input className="mf-input pl-9" placeholder="Search…" style={{ width: 160 }} /></div>
              <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /></button>
            </div>
          </div>
          <div className="overflow-x-auto mf-thin-scroll">
            <table className="w-full min-w-[640px] border-collapse">
              <thead><tr className="border-b" style={{ borderColor: "var(--mf-border)" }}>{["Request", "Patient", "Test", "Priority", "Status"].map((c) => <th key={c} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>{c}</th>)}</tr></thead>
              <tbody>
                {labRequests.map((r) => {
                  const av = AV[r.patient] ?? { a: "PT", c: "#6b7280" };
                  return (
                    <tr key={r.id} className="border-b transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                      <td className="px-5 py-3 text-[13px] font-semibold mf-nums" style={{ color: "var(--mf-primary)" }}>{r.id}</td>
                      <td className="px-5 py-3"><span className="flex items-center gap-2.5"><Avatar initials={av.a} color={av.c} size={30} /><span className="text-[13px] font-medium" style={{ color: "var(--mf-text)" }}>{r.patient}</span></span></td>
                      <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{r.test}</td>
                      <td className="px-5 py-3"><Pill tone={r.priority === "STAT" ? "error" : "neutral"} dot={r.priority === "STAT"}>{r.priority}</Pill></td>
                      <td className="px-5 py-3"><Pill tone={STATUS_TONE[r.status]} dot>{r.status}</Pill></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <SectionCard title="Result Reference" subtitle="CBC — James Sullivan" bodyClassName="space-y-3">
          {[
            { l: "Hemoglobin", v: "14.2", r: "13.5–17.5", ok: true },
            { l: "WBC", v: "11.8", r: "4.5–11.0", ok: false },
            { l: "Platelets", v: "245", r: "150–400", ok: true },
            { l: "Hematocrit", v: "42%", r: "41–50", ok: true },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5" style={{ borderColor: "var(--mf-border)" }}>
              <div className="flex-1">
                <p className="text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{x.l}</p>
                <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>Ref: {x.r}</p>
              </div>
              <span className="text-[15px] font-bold mf-nums" style={{ color: x.ok ? "var(--mf-success)" : "var(--mf-warning)" }}>{x.v}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: x.ok ? "var(--mf-success)" : "var(--mf-warning)" }} />
            </div>
          ))}
          <button className="mf-btn mf-btn-outline mt-1 w-full"><MessageSquare size={15} /> Add Doctor Comment</button>
        </SectionCard>
      </div>
    </div>
  );
}
