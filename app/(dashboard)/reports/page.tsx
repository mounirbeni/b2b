import Link from "next/link";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, type Status } from "@/types";

const PERIODS = {
  day: "اليوم",
  week: "هذا الأسبوع",
  month: "هذا الشهر",
} as const;
type Period = keyof typeof PERIODS;

function getRange(period: Period) {
  const now = new Date();
  switch (period) {
    case "day":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "week":
    default:
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
  }
}

export default async function ReportsPage({ searchParams }: { searchParams: { period?: string } }) {
  const session = await auth();
  const clinicId = session!.user.clinicId!;
  const period: Period = searchParams.period && searchParams.period in PERIODS ? (searchParams.period as Period) : "week";
  const { start, end } = getRange(period);

  const [statusCounts, newPatients, total] = await Promise.all([
    prisma.appointment.groupBy({
      by: ["status"],
      where: { clinicId, dateTime: { gte: start, lte: end } },
      _count: { _all: true },
    }),
    prisma.patient.count({ where: { clinicId, createdAt: { gte: start, lte: end } } }),
    prisma.appointment.count({ where: { clinicId, dateTime: { gte: start, lte: end } } }),
  ]);

  const countByStatus = Object.fromEntries(statusCounts.map((s) => [s.status, s._count._all])) as Record<
    string,
    number
  >;
  const completed = countByStatus["COMPLETED"] ?? 0;
  const noShow = countByStatus["NO_SHOW"] ?? 0;
  const cancelled = countByStatus["CANCELLED"] ?? 0;
  const attended = total - cancelled;
  const noShowRate = attended > 0 ? Math.round((noShow / attended) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">التقارير</h1>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء العيادة</p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(PERIODS) as Period[]).map((p) => (
          <Link
            key={p}
            href={`/reports?period=${p}`}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              p === period ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            {PERIODS[p]}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="إجمالي المواعيد" value={total} />
        <StatCard label="مرضى جدد" value={newPatients} />
        <StatCard label="مواعيد منتهية" value={completed} />
        <StatCard label="نسبة عدم الحضور" value={`${noShowRate}%`} />
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="mb-3 font-semibold">تفصيل حسب الحالة</h2>
          <div className="space-y-2">
            {(Object.keys(STATUS_LABELS) as Status[]).map((status) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{STATUS_LABELS[status]}</span>
                <span className="font-medium">{countByStatus[status] ?? 0}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
