import Link from "next/link";
import {
  Users, UserPlus, Search, Filter, Download, MoreHorizontal, Phone, Eye,
  ArrowUpDown, CheckCircle2, Clock, HeartPulse, UserCheck,
} from "lucide-react";
import { patients } from "@/lib/medflow/data";
import { Avatar, StatTile, PageHeader, StatusPill, Pill, Card } from "@/components/medflow/ui";

const STATS = [
  { label: "Total Patients", value: "8,642", icon: <Users size={18} />, tone: "primary", delta: 6.4 },
  { label: "Active This Month", value: "1,284", icon: <UserCheck size={18} />, tone: "success", delta: 12.1 },
  { label: "New Registrations", value: "142", icon: <UserPlus size={18} />, tone: "info", delta: 8.9 },
  { label: "Follow-ups Due", value: "37", icon: <HeartPulse size={18} />, tone: "warning", delta: -3.2 },
];

const COLS = ["Patient", "Phone", "Age / Gender", "Last Visit", "Doctor", "Insurance", "Status", ""];

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patients" subtitle="Professional patient records and profiles" icon={<Users size={20} />}>
        <button className="mf-btn mf-btn-outline"><Download size={16} /> Export</button>
        <button className="mf-btn mf-btn-primary"><UserPlus size={16} /> New Patient</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone as any} delta={s.delta} />
        ))}
      </div>

      <div className="mf-card overflow-hidden p-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4" style={{ borderColor: "var(--mf-border)" }}>
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
            <input className="mf-input pl-9" placeholder="Search by name, phone, or MRN…" />
          </div>
          <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /> Status</button>
          <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /> Doctor</button>
          <button className="mf-btn mf-btn-outline mf-btn-sm"><ArrowUpDown size={15} /> Sort</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mf-thin-scroll">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--mf-border)" }}>
                {COLS.map((c) => (
                  <th key={c} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="group border-b transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                  <td className="px-5 py-3">
                    <Link href={`/medflow/patients/${p.id}`} className="flex items-center gap-3">
                      <Avatar initials={p.avatar} color={p.color} size={38} />
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{p.name}</p>
                        <p className="text-[12px]" style={{ color: "var(--mf-text-3)" }}>{p.mrn} · {p.blood}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[13px] mf-nums" style={{ color: "var(--mf-text-2)" }}>{p.phone}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{p.age} · {p.gender}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{p.lastVisit}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{p.doctor.replace("Dr. ", "Dr ")}</td>
                  <td className="px-5 py-3"><Pill tone="neutral">{p.insurance}</Pill></td>
                  <td className="px-5 py-3"><StatusPill status={p.status} live={p.status === "in-consultation"} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><Phone size={15} /></button>
                      <Link href={`/medflow/patients/${p.id}`} className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><Eye size={15} /></Link>
                      <button className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><MoreHorizontal size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
          <span>Showing <b style={{ color: "var(--mf-text)" }}>1–8</b> of 8,642 patients</span>
          <div className="flex items-center gap-1.5">
            <button className="mf-btn mf-btn-outline mf-btn-sm">Previous</button>
            <button className="mf-btn mf-btn-outline mf-btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
