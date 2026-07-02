"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Edit, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/appointments/status-badge";
import { ReminderButton } from "@/components/reminders/reminder-button";
import { AppointmentModal } from "@/components/appointments/appointment-modal";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/date-utils";
import { APPOINTMENT_TYPE_LABELS } from "@/types";
import type { AppointmentType, AppointmentWithPatient } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AppointmentList({ date }: { date: Date }) {
  const dateKey = date.toISOString().slice(0, 10);
  const { data: appointments, mutate } = useSWR<AppointmentWithPatient[]>(
    `/api/appointments?date=${dateKey}`,
    fetcher
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithPatient | null>(null);

  const list = appointments ?? [];

  async function cancelAppointment(id: string) {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل إلغاء الموعد");
      toast.success("تم إلغاء الموعد");
      mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ ما");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{formatDateDisplay(date)}</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditingAppointment(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> موعد جديد
        </Button>
      </div>

      {list.length === 0 ? (
        <Card>
          <div className="p-6 text-center text-sm text-muted-foreground">لا توجد مواعيد في هذا اليوم</div>
        </Card>
      ) : (
        <div className="space-y-2">
          {list.map((appt) => (
            <Card key={appt.id} className="p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {formatTimeDisplay(appt.dateTime)} - {appt.patient.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {APPOINTMENT_TYPE_LABELS[appt.type as AppointmentType] ?? appt.type} · {appt.duration} دقيقة
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={appt.status} />
                  <ReminderButton appointmentId={appt.id} />
                  <Button
                    variant="outline"
                    size="icon"
                    title="تعديل"
                    onClick={() => {
                      setEditingAppointment(appt);
                      setModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="إلغاء" onClick={() => cancelAppointment(appt.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        appointment={editingAppointment}
        defaultDate={date}
        onSaved={() => mutate()}
      />
    </div>
  );
}
