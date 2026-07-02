import {
  BarChart3, Download, FileSpreadsheet, DollarSign, Users, CalendarCheck, Percent,
  Clock, TrendingUp, Sparkles,
} from "lucide-react";
import { revenueSeries, apptTrend, doctorShare, patientGrowth, doctors } from "@/lib/medflow/data";
import { StatTile, PageHeader, SectionCard, ProgressBar, Pill } from "@/components/medflow/ui";
import { AreaChart, BarChart, DonutChart } from "@/components/medflow/charts";

const STATS = [
  { label: "Total Revenue", value: "$186,540", icon: <DollarSign size={18} />, tone: "success", delta: 22.1 },
  { label: "Net Profit", value: "$74,320", icon: <TrendingUp size={18} />, tone: "primary", delta: 18.4 },
  { label: "Appointments", value: "3,428", icon: <CalendarCheck size={18} />, tone: "info", delta: 12.0 },
  { label: "New Patients", value: "612", icon: <Users size={18} />, tone: "primary", delta: 9.7 },
  { label: "Cancellation Rate", value: "4.2%", icon: <Percent size={18} />, tone: "warning", delta: -1.8, invert: true },
  { label: "Avg. Wait Time", value: "12m", icon: <Clock size={18} />, tone: "info", delta: -14, invert: true },
];

const PEAK = [
  { label: "8a", v: 22 }, { label: "9a", v: 48 }, { label: "10a", v: 62 }, { label: "11a", v: 55 },
  { label: "12p", v: 30 }, { label: "1p", v: 26 }, { label: "2p", v: 58 }, { label: "3p", v: 64 },
  { label: "4p", v: 44 }, { label: "5p", v: 28 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Executive analytics across the entire clinic" icon={<BarChart3 size={20} />}>
        <button className="mf-btn mf-btn-outline"><FileSpreadsheet size={16} /> Excel</button>
        <button className="mf-btn mf-btn-primary"><Download size={16} /> Export PDF</button>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {STATS.map((s) => <StatTile key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone as any} delta={s.delta} invertDelta={(s as any).invert} />)}
      </div>

      {/* AI insight banner */}
      <div className="relative overflow-hidden rounded-2xl border p-5" style={{ borderColor: "var(--mf-border)", background: "var(--mf-primary-soft)" }}>
        <div className="absolute inset-0 mf-mesh opacity-70" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl mf-brand-gradient text-white"><Sparkles size={20} /></span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>AI Analytics Insight</p>
            <p className="text-[13px]" style={{ color: "var(--mf-text-2)" }}>Revenue is up 22% MoM, driven by cardiology (+34%). Peak congestion is 10–11 AM & 3 PM — consider adding a mid-morning slot for Dr. Chen to cut wait times ~18%.</p>
          </div>
          <button className="mf-btn mf-btn-primary shrink-0">Generate Full Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Revenue vs. Profit" subtitle="Monthly performance">
          <AreaChart data={revenueSeries} />
        </SectionCard>
        <SectionCard title="Service Distribution" subtitle="By department">
          <DonutChart data={doctorShare} centerLabel="3.4k" centerSub="visits" />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Peak Hours" subtitle="Appointment volume by hour" action={<Pill tone="warning" dot>Busiest 10–11 AM</Pill>}>
          <BarChart data={PEAK} color="var(--mf-c3)" />
        </SectionCard>
        <SectionCard title="Doctor Performance" subtitle="Consultations & satisfaction" bodyClassName="space-y-3.5">
          {doctors.slice(0, 5).map((d) => (
            <div key={d.id}>
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="font-medium" style={{ color: "var(--mf-text)" }}>{d.name.replace("Dr. ", "Dr ")}</span>
                <span className="mf-nums" style={{ color: "var(--mf-text-2)" }}>{d.patientsToday * 8} visits · ★ {d.rating}</span>
              </div>
              <ProgressBar value={d.utilization} color={d.color} />
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
