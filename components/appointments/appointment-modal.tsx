"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeSlots } from "@/lib/date-utils";
import { APPOINTMENT_DURATIONS, APPOINTMENT_TYPE_LABELS, APPOINTMENT_TYPES } from "@/types";
import type { AppointmentWithPatient, Patient } from "@/types";

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultTime?: string;
  appointment?: AppointmentWithPatient | null;
  onSaved?: () => void;
}

const timeSlots = generateTimeSlots();

export function AppointmentModal({
  open,
  onOpenChange,
  defaultDate,
  defaultTime,
  appointment,
  onSaved,
}: AppointmentModalProps) {
  const isEdit = !!appointment;

  const [mode, setMode] = useState<"search" | "new">("search");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(appointment?.patient ?? null);

  const [newPatient, setNewPatient] = useState({ name: "", phone: "", birthDate: "", gender: "", notes: "" });

  const [date, setDate] = useState(
    appointment ? new Date(appointment.dateTime).toISOString().slice(0, 10) : (defaultDate ?? new Date()).toISOString().slice(0, 10)
  );
  const [time, setTime] = useState(
    appointment
      ? new Date(appointment.dateTime).toTimeString().slice(0, 5)
      : defaultTime ?? "09:00"
  );
  const [duration, setDuration] = useState(appointment?.duration ?? 30);
  const [type, setType] = useState(appointment?.type ?? "CONSULTATION");
  const [notes, setNotes] = useState(appointment?.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedPatient(appointment?.patient ?? null);
    setMode("search");
    setSearch("");
    setResults([]);
    setDate(
      appointment
        ? new Date(appointment.dateTime).toISOString().slice(0, 10)
        : (defaultDate ?? new Date()).toISOString().slice(0, 10)
    );
    setTime(appointment ? new Date(appointment.dateTime).toTimeString().slice(0, 5) : defaultTime ?? "09:00");
    setDuration(appointment?.duration ?? 30);
    setType(appointment?.type ?? "CONSULTATION");
    setNotes(appointment?.notes ?? "");
  }, [open, appointment, defaultDate, defaultTime]);

  useEffect(() => {
    if (mode !== "search" || search.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/patients?search=${encodeURIComponent(search)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.data ?? []);
      } catch {
        // ignore aborted requests
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, mode]);

  async function handleSave() {
    setSaving(true);
    try {
      let patientId = selectedPatient?.id;

      if (mode === "new") {
        if (!newPatient.name || !newPatient.phone) {
          toast.error("اسم المريض والهاتف مطلوبان");
          setSaving(false);
          return;
        }
        const res = await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPatient),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "فشل إنشاء المريض");
        patientId = data.id;
      }

      if (!patientId) {
        toast.error("يرجى اختيار مريض");
        setSaving(false);
        return;
      }

      const payload = { patientId, date, time, duration, type, notes };

      const res = await fetch(isEdit ? `/api/appointments/${appointment!.id}` : "/api/appointments", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل حفظ الموعد");

      toast.success(isEdit ? "تم تحديث الموعد" : "تم إضافة الموعد");
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل الموعد" : "موعد جديد"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>المريض</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between rounded-md border p-2">
                <div>
                  <p className="text-sm font-medium">{selectedPatient.name}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {selectedPatient.phone}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>
                  تغيير
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={mode === "search" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("search")}
                  >
                    <Search className="ml-1 h-3.5 w-3.5" /> مريض موجود
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "new" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("new")}
                  >
                    <UserPlus className="ml-1 h-3.5 w-3.5" /> مريض جديد
                  </Button>
                </div>

                {mode === "search" ? (
                  <div className="space-y-1">
                    <Input
                      placeholder="ابحث بالاسم أو الهاتف..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {results.length > 0 && (
                      <div className="max-h-40 overflow-y-auto rounded-md border">
                        {results.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className="flex w-full flex-col items-start px-3 py-2 text-right text-sm hover:bg-accent"
                            onClick={() => {
                              setSelectedPatient(p);
                              setResults([]);
                            }}
                          >
                            <span className="font-medium">{p.name}</span>
                            <span className="text-xs text-muted-foreground" dir="ltr">
                              {p.phone}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="اسم المريض"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient((s) => ({ ...s, name: e.target.value }))}
                    />
                    <Input
                      placeholder="الهاتف"
                      dir="ltr"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient((s) => ({ ...s, phone: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={newPatient.birthDate}
                      onChange={(e) => setNewPatient((s) => ({ ...s, birthDate: e.target.value }))}
                    />
                    <Select
                      value={newPatient.gender}
                      onValueChange={(v) => setNewPatient((s) => ({ ...s, gender: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="الجنس" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">ذكر</SelectItem>
                        <SelectItem value="FEMALE">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      className="col-span-2"
                      placeholder="ملاحظات"
                      value={newPatient.notes}
                      onChange={(e) => setNewPatient((s) => ({ ...s, notes: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>التاريخ</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>الوقت</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المدة (دقيقة)</Label>
              <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_DURATIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} دقيقة
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نوع الموعد</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {APPOINTMENT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>ملاحظات</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
