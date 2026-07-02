import Link from "next/link";
import { BarChart3, DollarSign } from "lucide-react";
import { requireClinicSession } from "@/lib/auth-guard";
import { getReportsData } from "@/lib/medflow/live";
import { PageHeader, SectionCard, StatTile } from "@/components/medflow/ui";
import { DonutChart } from "@/components/medflow/charts";
import { REAL_STATUS_META } from "@/lib/medflow/real-status";
import type { Status } from "@/types";

const PERIODS = { day: "Today", week: "This Week", month: "This Month" } as const;
type Period = keyof typeof PERIODS;

function getRange(period: Period) {
  const now = new Date();
  if (period === "day") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }
  const day = now.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const start = new Date(now);
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default async function ReportsPage({ searchParams }: { searchParams: { period?: string } }) {
  const session = await requireClinicSession();
  const period: Period = searchParams.period && searchParams.period in PERIODS ? (searchParams.period as Period) : "week";
  const range = getRange(period);
  const report = await getReportsData(session!.user.clinicId, range);

  const donutData = (Object.keys(REAL_STATUS_META) as Status[])
    .map((s) => ({ label: REAL_STATUS_META[s].label, v: report.countByStatus[s], color: REAL_STATUS_META[s].dot }))
    .filter((d) => d.v > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Real performance data for your clinic" icon={<BarChart3 size={20} />} />

      <div className="flex gap-2">
        {(Object.keys(PERIODS) as Period[]).map((p) => (
          <Link
            key={p}
            href={`/medflow/reports?period=${p}`}
            className="mf-btn mf-btn-sm"
            style={p === period ? { background: "var(--mf-primary)", color: "#fff" } : { background: "var(--mf-surface)", color: "var(--mf-text-2)", border: "1px solid var(--mf-border)" }}
          >
            {PERIODS[p]}
          </Link>
        ))}
      </div>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total Appointments" value={String(report.total)} tone="primary" icon={<BarChart3 size={18} />} />
        <StatTile label="New Patients" value={String(report.newPatients)} tone="success" />
        <StatTile label="Completed" value={String(report.completed)} tone="info" />
        <StatTile label="No-show Rate" value={`${report.noShowRate}%`} tone="warning" invertDelta />
      </div>

      <SectionCard title="Breakdown by Status" subtitle={PERIODS[period]}>
        {donutData.length > 0 ? (
          <DonutChart data={donutData} centerLabel={String(report.total)} centerSub="appointments" />
        ) : (
          <p className="py-10 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No appointments in this period.</p>
        )}
      </SectionCard>

      <div className="mf-card p-5" style={{ background: "var(--mf-surface-2)" }}>
        <p className="flex items-center gap-2 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
          <DollarSign size={15} /> Billing and revenue reporting aren't available yet — this plan doesn't track invoices or payments.
        </p>
      </div>
    </div>
  );
}
