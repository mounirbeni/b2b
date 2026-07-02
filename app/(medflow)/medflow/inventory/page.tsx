import {
  Boxes, Plus, Search, AlertTriangle, Package, TrendingDown, CalendarClock, Filter, ShoppingCart,
} from "lucide-react";
import { inventory } from "@/lib/medflow/data";
import { StatTile, PageHeader, Pill, ProgressBar } from "@/components/medflow/ui";

const STATS = [
  { label: "Total Items", value: "1,842", icon: <Package size={18} />, tone: "primary", delta: 3.1 },
  { label: "Low Stock", value: "23", icon: <TrendingDown size={18} />, tone: "warning", delta: 8, invert: true },
  { label: "Expiring Soon", value: "11", icon: <CalendarClock size={18} />, tone: "error", delta: 2, invert: true },
  { label: "Suppliers", value: "38", icon: <ShoppingCart size={18} />, tone: "info", delta: 0 },
];

const STATUS_TONE: Record<string, { tone: "success" | "warning" | "error" | "info"; label: string }> = {
  ok: { tone: "success", label: "In Stock" },
  low: { tone: "warning", label: "Low Stock" },
  critical: { tone: "error", label: "Critical" },
  expiring: { tone: "info", label: "Expiring" },
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" subtitle="Medicines, supplies, equipment & stock movement" icon={<Boxes size={20} />}>
        <button className="mf-btn mf-btn-outline"><ShoppingCart size={16} /> Purchase Order</button>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> Add Item</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatTile key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone as any} delta={s.delta} invertDelta={(s as any).invert} />)}
      </div>

      {/* Alerts */}
      <div className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: "color-mix(in srgb, var(--mf-error) 35%, var(--mf-border))", background: "var(--mf-error-soft)" }}>
        <AlertTriangle size={18} style={{ color: "var(--mf-error)" }} />
        <span className="text-[13px]" style={{ color: "var(--mf-text)" }}><b>Insulin Glargine</b> is critically low (18 units) — reorder point is 40. <b>Paracetamol 1g</b> expires this month.</span>
        <button className="mf-btn mf-btn-sm ml-auto shrink-0" style={{ background: "var(--mf-error)", color: "#fff" }}>Reorder Now</button>
      </div>

      <div className="mf-card overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: "var(--mf-border)" }}>
          <p className="text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>Stock Levels</p>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} /><input className="mf-input pl-9" placeholder="Search items…" style={{ width: 180 }} /></div>
            <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /> Category</button>
          </div>
        </div>
        <div className="overflow-x-auto mf-thin-scroll">
          <table className="w-full min-w-[720px] border-collapse">
            <thead><tr className="border-b" style={{ borderColor: "var(--mf-border)" }}>{["Item", "Category", "Stock Level", "Reorder At", "Expiry", "Status"].map((c) => <th key={c} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>{c}</th>)}</tr></thead>
            <tbody>
              {inventory.map((i) => {
                const st = STATUS_TONE[i.status];
                const pct = Math.min((i.stock / (i.reorder * 1.5)) * 100, 100);
                const color = i.status === "critical" ? "var(--mf-error)" : i.status === "low" ? "var(--mf-warning)" : "var(--mf-success)";
                return (
                  <tr key={i.id} className="border-b transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                    <td className="px-5 py-3 text-[13.5px] font-semibold" style={{ color: "var(--mf-text)" }}>{i.name}</td>
                    <td className="px-5 py-3"><Pill tone="neutral">{i.category}</Pill></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div style={{ width: 96 }}><ProgressBar value={pct} color={color} /></div>
                        <span className="text-[13px] font-semibold mf-nums" style={{ color: "var(--mf-text)" }}>{i.stock.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] mf-nums" style={{ color: "var(--mf-text-2)" }}>{i.reorder}</td>
                    <td className="px-5 py-3 text-[13px] mf-nums" style={{ color: "var(--mf-text-2)" }}>{i.expiry}</td>
                    <td className="px-5 py-3"><Pill tone={st.tone} dot>{st.label}</Pill></td>
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
