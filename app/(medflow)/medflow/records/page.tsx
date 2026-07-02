import {
  FileText, Search, Stethoscope, Scissors, HeartPulse, Syringe, Users, AlertTriangle,
  Activity, FileImage, Paperclip, Plus, ChevronRight,
} from "lucide-react";
import { PageHeader, SectionCard, Avatar, Pill } from "@/components/medflow/ui";

const CATEGORIES = [
  { label: "Diagnoses", count: 14, icon: <Stethoscope size={18} />, tone: "var(--mf-primary)" },
  { label: "Surgeries", count: 3, icon: <Scissors size={18} />, tone: "var(--mf-info)" },
  { label: "Chronic Diseases", count: 2, icon: <HeartPulse size={18} />, tone: "var(--mf-error)" },
  { label: "Vaccinations", count: 21, icon: <Syringe size={18} />, tone: "var(--mf-success)" },
  { label: "Family History", count: 5, icon: <Users size={18} />, tone: "var(--mf-c3)" },
  { label: "Allergies", count: 2, icon: <AlertTriangle size={18} />, tone: "var(--mf-warning)" },
  { label: "Vitals", count: 48, icon: <Activity size={18} />, tone: "var(--mf-secondary)" },
  { label: "Images", count: 9, icon: <FileImage size={18} />, tone: "var(--mf-c5)" },
];

const RECORDS = [
  { title: "Angina pectoris (I20.9)", type: "Diagnosis", doctor: "Dr. Sarah Chen", date: "Jun 28, 2026", tone: "primary" as const },
  { title: "Appendectomy", type: "Surgery", doctor: "Dr. Liam Novak", date: "Aug 14, 2015", tone: "info" as const },
  { title: "COVID-19 Booster", type: "Vaccination", doctor: "Dr. Amara Okafor", date: "Nov 02, 2025", tone: "success" as const },
  { title: "Essential Hypertension (I10)", type: "Chronic", doctor: "Dr. Sarah Chen", date: "Mar 12, 2021", tone: "error" as const },
];

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Medical Records" subtitle="Complete Electronic Health Record (EHR)" icon={<FileText size={20} />}>
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
          <input className="mf-input pl-9" placeholder="Search records…" style={{ width: 220 }} />
        </div>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> New Record</button>
      </PageHeader>

      {/* Patient context */}
      <div className="mf-card flex items-center gap-3 px-5 py-4">
        <Avatar initials="EF" color="#2563eb" size={44} />
        <div><p className="text-[15px] font-bold" style={{ color: "var(--mf-text)" }}>Elena Fisher</p><p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>MRN-10432 · 34 yrs · O+ · Complete history on file</p></div>
        <Pill tone="success" dot>Up to date</Pill>
      </div>

      <div className="mf-stagger grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CATEGORIES.map((c) => (
          <button key={c.label} className="mf-card mf-card-hover p-4 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ color: c.tone, background: `color-mix(in srgb, ${c.tone} 14%, transparent)` }}>{c.icon}</span>
            <p className="mt-3 text-[22px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{c.count}</p>
            <p className="text-[13px]" style={{ color: "var(--mf-text-2)" }}>{c.label}</p>
          </button>
        ))}
      </div>

      <SectionCard title="Recent Records" bodyClassName="px-0 pb-0">
        {RECORDS.map((r) => (
          <div key={r.title} className="flex items-center gap-3 border-t px-5 py-3.5 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}><FileText size={16} /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{r.title}</p>
              <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{r.doctor} · {r.date}</p>
            </div>
            <Pill tone={r.tone}>{r.type}</Pill>
            <ChevronRight size={16} style={{ color: "var(--mf-text-3)" }} />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
