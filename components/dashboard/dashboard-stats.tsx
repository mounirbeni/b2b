"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentWithPatient } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardStats({
  initialAppointments,
  dateKey,
}: {
  initialAppointments: AppointmentWithPatient[];
  dateKey: string;
}) {
  const { data: appointments } = useSWR<AppointmentWithPatient[]>(
    `/api/appointments?date=${dateKey}`,
    fetcher,
    { fallbackData: initialAppointments, revalidateOnFocus: false }
  );

  const list = appointments ?? [];
  const total = list.length;
  const waiting = list.filter((a) => a.status === "WAITING").length;
  const completed = list.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="مواعيد اليوم" value={total} />
      <StatCard label="في الانتظار" value={waiting} />
      <StatCard label="منتهية" value={completed} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
