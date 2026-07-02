import { UsersRound, Plus, Search, Filter, ShieldCheck, Clock, MoreHorizontal } from "lucide-react";
import { PageHeader, SectionCard, StatTile, Avatar, Pill } from "@/components/medflow/ui";

const STATS = [
  { label: "Total Staff", value: "48", icon: <UsersRound size={18} />, tone: "primary", delta: 4 },
  { label: "Present Today", value: "42", icon: <Clock size={18} />, tone: "success", delta: 2 },
  { label: "On Leave", value: "4", icon: <Clock size={18} />, tone: "warning", delta: 0 },
  { label: "Roles Defined", value: "9", icon: <ShieldCheck size={18} />, tone: "info", delta: 0 },
];

const STAFF = [
  { name: "Dr. Sarah Chen", av: "SC", c: "#2563eb", role: "Doctor", dept: "Cardiology", status: "Present", tone: "success" as const },
  { name: "Nina Patel", av: "NP", c: "#10b981", role: "Head Nurse", dept: "General", status: "Present", tone: "success" as const },
  { name: "Carlos Mendez", av: "CM", c: "#f59e0b", role: "Receptionist", dept: "Front Desk", status: "Present", tone: "success" as const },
  { name: "Dr. Liam Novak", av: "LN", c: "#8b5cf6", role: "Doctor", dept: "Orthopedics", status: "On Leave", tone: "warning" as const },
  { name: "Grace Kim", av: "GK", c: "#ec4899", role: "Lab Technician", dept: "Laboratory", status: "Present", tone: "success" as const },
  { name: "Ahmed Farsi", av: "AF", c: "#0ea5e9", role: "Manager", dept: "Administration", status: "Remote", tone: "info" as const },
];

const ROLES: Record<string, "primary" | "info" | "success" | "warning" | "neutral"> = {
  Doctor: "primary", "Head Nurse": "success", "Lab Technician": "info", Receptionist: "neutral", Manager: "warning",
};

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" subtitle="Roles, permissions, attendance & schedules" icon={<UsersRound size={20} />}>
        <button className="mf-btn mf-btn-outline"><ShieldCheck size={16} /> Roles</button>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> Add Staff</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatTile key={s.label} {...s} tone={s.tone as any} />)}
      </div>

      <div className="mf-card overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: "var(--mf-border)" }}>
          <p className="text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>Team Directory</p>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} /><input className="mf-input pl-9" placeholder="Search staff…" style={{ width: 180 }} /></div>
            <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /> Role</button>
          </div>
        </div>
        <div className="overflow-x-auto mf-thin-scroll">
          <table className="w-full min-w-[680px] border-collapse">
            <thead><tr className="border-b" style={{ borderColor: "var(--mf-border)" }}>{["Name", "Role", "Department", "Attendance", "Status", ""].map((c) => <th key={c} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>{c}</th>)}</tr></thead>
            <tbody>
              {STAFF.map((s) => (
                <tr key={s.name} className="group border-b transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                  <td className="px-5 py-3"><span className="flex items-center gap-2.5"><Avatar initials={s.av} color={s.c} size={34} /><span className="text-[13.5px] font-semibold" style={{ color: "var(--mf-text)" }}>{s.name}</span></span></td>
                  <td className="px-5 py-3"><Pill tone={ROLES[s.role] ?? "neutral"}>{s.role}</Pill></td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{s.dept}</td>
                  <td className="px-5 py-3 text-[13px] mf-nums" style={{ color: "var(--mf-text-2)" }}>{[96, 99, 92, 78, 100, 88][STAFF.indexOf(s)]}%</td>
                  <td className="px-5 py-3"><Pill tone={s.tone} dot>{s.status}</Pill></td>
                  <td className="px-5 py-3"><button className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
