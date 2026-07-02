import {
  CreditCard, Plus, Download, Search, Filter, DollarSign, TrendingUp, Clock, AlertCircle,
  MoreHorizontal, Printer, Receipt,
} from "lucide-react";
import { invoices } from "@/lib/medflow/data";
import { Avatar, StatTile, PageHeader, Pill, SectionCard } from "@/components/medflow/ui";
import { AreaChart } from "@/components/medflow/charts";
import { revenueSeries } from "@/lib/medflow/data";

const STATS = [
  { label: "Revenue This Month", value: "$186,540", icon: <DollarSign size={18} />, tone: "success", delta: 22.1 },
  { label: "Outstanding", value: "$24,180", icon: <Clock size={18} />, tone: "warning", delta: -6.4 },
  { label: "Collected Today", value: "$8,240", icon: <TrendingUp size={18} />, tone: "primary", delta: 9.4 },
  { label: "Overdue Invoices", value: "12", icon: <AlertCircle size={18} />, tone: "error", delta: -14, invert: true },
];

const STATUS_TONE: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  Paid: "success", Pending: "warning", Overdue: "error", Refunded: "neutral",
};

const AVATARS: Record<string, { a: string; c: string }> = {
  "David Park": { a: "DP", c: "#0ea5e9" }, "Elena Fisher": { a: "EF", c: "#2563eb" },
  "Robert Klein": { a: "RK", c: "#f59e0b" }, "Maria Gonzalez": { a: "MG", c: "#ec4899" },
  "Sofia Rossi": { a: "SR", c: "#14b8a6" },
};

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="Invoices, payments, insurance claims & refunds" icon={<CreditCard size={20} />}>
        <button className="mf-btn mf-btn-outline"><Download size={16} /> Export</button>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> New Invoice</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatTile key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone as any} delta={s.delta} invertDelta={(s as any).invert} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Revenue & Collections" subtitle="Billed vs. collected · last 6 months"
          action={<div className="flex items-center gap-3 text-[12px]"><span className="flex items-center gap-1.5" style={{ color: "var(--mf-text-2)" }}><span className="mf-dot" style={{ background: "var(--mf-c1)" }} /> Billed</span><span className="flex items-center gap-1.5" style={{ color: "var(--mf-text-2)" }}><span className="mf-dot" style={{ background: "var(--mf-c2)" }} /> Collected</span></div>}>
          <AreaChart data={revenueSeries} labelA="Billed" labelB="Collected" />
        </SectionCard>
        <SectionCard title="Payment Methods" bodyClassName="space-y-4">
          {[{ l: "Card", v: 62, c: "var(--mf-c1)" }, { l: "Insurance", v: 24, c: "var(--mf-c2)" }, { l: "Cash", v: 10, c: "var(--mf-c3)" }, { l: "Bank Transfer", v: 4, c: "var(--mf-c4)" }].map((m) => (
            <div key={m.l}>
              <div className="mb-1.5 flex justify-between text-[13px]"><span style={{ color: "var(--mf-text-2)" }}>{m.l}</span><span className="font-semibold mf-nums" style={{ color: "var(--mf-text)" }}>{m.v}%</span></div>
              <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--mf-surface-hover)" }}><div className="h-full rounded-full" style={{ width: `${m.v}%`, background: m.c }} /></div>
            </div>
          ))}
        </SectionCard>
      </div>

      <div className="mf-card overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-3 border-b p-4" style={{ borderColor: "var(--mf-border)" }}>
          <p className="text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>Recent Invoices</p>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} /><input className="mf-input pl-9" placeholder="Search invoice…" style={{ width: 180 }} /></div>
            <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /> Status</button>
          </div>
        </div>
        <div className="overflow-x-auto mf-thin-scroll">
          <table className="w-full min-w-[760px] border-collapse">
            <thead><tr className="border-b" style={{ borderColor: "var(--mf-border)" }}>{["Invoice", "Patient", "Amount", "Method", "Insurance", "Date", "Status", ""].map((c) => <th key={c} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>{c}</th>)}</tr></thead>
            <tbody>
              {invoices.map((inv) => {
                const av = AVATARS[inv.patient] ?? { a: "PT", c: "#6b7280" };
                return (
                  <tr key={inv.id} className="group border-b transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                    <td className="px-5 py-3 text-[13px] font-semibold mf-nums" style={{ color: "var(--mf-primary)" }}>{inv.id}</td>
                    <td className="px-5 py-3"><span className="flex items-center gap-2.5"><Avatar initials={av.a} color={av.c} size={30} /><span className="text-[13px] font-medium" style={{ color: "var(--mf-text)" }}>{inv.patient}</span></span></td>
                    <td className="px-5 py-3 text-[14px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>${inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{inv.method}</td>
                    <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{inv.insurance}</td>
                    <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{inv.date}</td>
                    <td className="px-5 py-3"><Pill tone={STATUS_TONE[inv.status]} dot>{inv.status}</Pill></td>
                    <td className="px-5 py-3"><div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100"><button className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><Printer size={15} /></button><button className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><MoreHorizontal size={15} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
