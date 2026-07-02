"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Edit, Plus, Send, UserPlus, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/appointments/status-badge";
import { ReminderButton } from "@/components/reminders/reminder-button";
import { AppointmentModal } from "@/components/appointments/appointment-modal";
import { generateTimeSlots } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { AppointmentWithPatient, Status } from "@/types";
import { STATUS_LABELS } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STATUS_OPTIONS: Status[] = [
  "SCHEDULED",
  "CONFIRMED",
  "WAITING",
  "IN_PROGRESS",
  "COMPLETED",
  "NO_SHOW",
  "CANCELLED",
];

const timeSlots = generateTimeSlots();

export function DailySchedule({
  initialAppointments,
  dateKey,
}: {
  initialAppointments: AppointmentWithPatient[];
  dateKey: string;
}) {
  const { data: appointments, mutate } = useSWR<AppointmentWithPatient[]>(
    `/api/appointments?date=${dateKey}`,
    fetcher,
    { fallbackData: initialAppointments, revalidateOnFocus: false }
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithPatient | null>(null);
  const [defaultSlotTime, setDefaultSlotTime] = useState<string | undefined>();
  const [sendingAll, setSendingAll] = useState(false);

  const list = appointments ?? [];

  const slotMap = useMemo(() => {
    const map = new Map<string, AppointmentWithPatient[]>();
    for (const appt of list) {
      const time = new Date(appt.dateTime).toTimeString().slice(0, 5);
      map.set(time, [...(map.get(time) ?? []), appt]);
    }
    return map;
  }, [list]);

  async function updateStatus(id: string, status: Status) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("فشل تحديث الحالة");
      toast.success("تم تحديث حالة الموعد");
      mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ ما");
    }
  }

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

  async function sendAllReminders() {
    const scheduled = list.filter((a) => a.status === "SCHEDULED" || a.status === "CONFIRMED");
    if (scheduled.length === 0) {
      toast.info("لا توجد مواعيد لإرسال تذكير لها");
      return;
    }
    setSendingAll(true);
    let sent = 0;
    for (const appt of scheduled) {
      const res = await fetch("/api/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: appt.id }),
      });
      if (res.ok) sent++;
    }
    setSendingAll(false);
    toast.success(`تم إرسال ${sent} من ${scheduled.length} تذكير`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => {
            setEditingAppointment(null);
            setDefaultSlotTime(undefined);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> موعد جديد
        </Button>
        <Button variant="outline" asChild>
          <Link href="/patients/new">
            <UserPlus className="h-4 w-4" /> مريض جديد
          </Link>
        </Button>
        <Button variant="secondary" onClick={sendAllReminders} disabled={sendingAll}>
          <Send className="h-4 w-4" /> {sendingAll ? "جاري الإرسال..." : "إرسال جميع التذكيرات"}
        </Button>
      </div>

      <Card className="divide-y">
        {timeSlots.map((slot) => {
          const slotAppointments = slotMap.get(slot) ?? [];
          return (
            <div key={slot} className="flex items-start gap-4 p-3">
              <div className="w-14 shrink-0 pt-1 text-sm font-medium text-muted-foreground" dir="ltr">
                {slot}
              </div>
              <div className="flex-1 space-y-2">
                {slotAppointments.length === 0 ? (
                  <button
                    className="w-full rounded-md border border-dashed p-2 text-right text-xs text-muted-foreground hover:bg-slate-50"
                    onClick={() => {
                      setEditingAppointment(null);
                      setDefaultSlotTime(slot);
                      setModalOpen(true);
                    }}
                  >
                    + إضافة موعد
                  </button>
                ) : (
                  slotAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-2 rounded-md border p-2",
                        appt.status === "CANCELLED" && "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            appt.status === "CANCELLED" && "line-through"
                          )}
                        >
                          {appt.patient.name}
                        </span>
                        <StatusBadge status={appt.status} />
                      </div>
                      <div className="flex items-center gap-1">
                        <Select value={appt.status} onValueChange={(v) => updateStatus(appt.id, v as Status)}>
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Button
                          variant="outline"
                          size="icon"
                          title="إلغاء"
                          onClick={() => cancelAppointment(appt.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </Card>

      <AppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        appointment={editingAppointment}
        defaultTime={defaultSlotTime}
        onSaved={() => mutate()}
      />
    </div>
  );
}
