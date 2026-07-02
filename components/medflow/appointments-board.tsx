"use client";

import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Search, Play, RotateCcw,
  X, CheckCircle2, Clock, User, Tag, Timer,
} from "lucide-react";
import type { AppointmentWithPatient, Status } from "@/types";
import { REAL_STATUS_META, RealStatusPill } from "@/lib/medflow/real-status";
import { Avatar, PageHeader } from "@/components/medflow/ui";
import { initialsOf, colorFor } from "@/lib/medflow/live";
import { AppointmentModal } from "@/components/appointments/appointment-modal";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i); // 8 -> 20
const ROW_H = 56;
const START_MIN = 8 * 60;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfDay(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}
function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function AppointmentBlock({ a, onClick }: { a: AppointmentWithPatient; onClick: () => void }) {
  const dt = new Date(a.dateTime);
  const meta = REAL_STATUS_META[a.status as Status];
  const minutes = dt.getHours() * 60 + dt.getMinutes();
  const top = ((minutes - START_MIN) / 60) * ROW_H;
  const height = Math.max((a.duration / 60) * ROW_H - 4, 22);
  return (
    <button
      onClick={onClick}
      className="mf-card-hover absolute left-1 right-1 overflow-hidden rounded-lg border-l-[3px] px-2 py-1.5 text-left transition-all"
      style={{ top, height, background: meta.bg, borderLeftColor: meta.fg, boxShadow: "var(--mf-shadow-sm)" }}
    >
      <p className="truncate text-[11.5px] font-semibold leading-tight" style={{ color: meta.fg }}>
        {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {a.patient.name}
      </p>
      {height > 34 && <p className="truncate text-[11px]" style={{ color: "var(--mf-text-2)" }}>{a.type}</p>}
    </button>
  );
}

function Drawer({
  a,
  onClose,
  onMutate,
  onEdit,
}: {
  a: AppointmentWithPatient | null;
  onClose: () => void;
  onMutate: () => void;
  onEdit: () => void;
}) {
  const [busy, setBusy] = React.useState(false);
  if (!a) return null;
  const dt = new Date(a.dateTime);

  async function updateStatus(status: Status) {
    setBusy(true);
    try {
      const res = await fetch(`/api/appointments/${a!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم التحديث بنجاح");
      onMutate();
      onClose();
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setBusy(false);
    }
  }

  async function cancelAppointment() {
    setBusy(true);
    try {
      const res = await fetch(`/api/appointments/${a!.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم إلغاء الموعد");
      onMutate();
      onClose();
    } catch {
      toast.error("فشل الإلغاء");
    } finally {
      setBusy(false);
    }
  }

  const rows = [
    { icon: <User size={16} />, label: "Patient", value: a.patient.name },
    { icon: <Tag size={16} />, label: "Type", value: a.type },
    { icon: <Clock size={16} />, label: "Time", value: `${dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · ${a.duration} min` },
    { icon: <Timer size={16} />, label: "Phone", value: a.patient.phone },
  ];

  return (
    <div className="fixed inset-0 z-[65]">
      <div className="mf-animate-fade absolute inset-0" style={{ background: "rgba(2,6,23,0.5)" }} onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l" style={{ background: "var(--mf-surface)", borderColor: "var(--mf-border)", animation: "mf-scale-in 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--mf-border)" }}>
          <div className="flex items-center gap-3">
            <Avatar initials={initialsOf(a.patient.name)} color={colorFor(a.patientId)} size={42} />
            <div>
              <p className="text-[15px] font-bold" style={{ color: "var(--mf-text)" }}>{a.patient.name}</p>
              <RealStatusPill status={a.status as Status} live={a.status === "IN_PROGRESS"} />
            </div>
          </div>
          <button className="mf-btn mf-btn-ghost mf-btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 mf-thin-scroll">
          <div className="mf-card divide-y" style={{ borderColor: "var(--mf-border)" }}>
            {rows.map((r) => (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: "var(--mf-border-soft)" }}>
                <span style={{ color: "var(--mf-text-3)" }}>{r.icon}</span>
                <span className="text-[13px]" style={{ color: "var(--mf-text-2)" }}>{r.label}</span>
                <span className="ml-auto text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{r.value}</span>
              </div>
            ))}
          </div>

          {a.notes && (
            <>
              <p className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>Notes</p>
              <div className="mf-card p-4 text-[13px] leading-relaxed" style={{ color: "var(--mf-text-2)" }}>{a.notes}</div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t p-4" style={{ borderColor: "var(--mf-border)" }}>
          <button disabled={busy} onClick={() => updateStatus("IN_PROGRESS")} className="mf-btn mf-btn-primary col-span-2"><Play size={16} /> Start Consultation</button>
          <button disabled={busy} onClick={onEdit} className="mf-btn mf-btn-outline"><RotateCcw size={15} /> Reschedule</button>
          <button disabled={busy} onClick={() => updateStatus("COMPLETED")} className="mf-btn mf-btn-outline"><CheckCircle2 size={15} /> Complete</button>
          <button disabled={busy} onClick={() => updateStatus("NO_SHOW")} className="mf-btn mf-btn-outline">No-show</button>
          <button disabled={busy} onClick={cancelAppointment} className="mf-btn mf-btn-outline" style={{ color: "var(--mf-error)" }}><X size={15} /> Cancel</button>
        </div>
      </aside>
    </div>
  );
}

export function AppointmentsBoard({
  initialAppointments,
  rangeFrom,
  rangeTo,
}: {
  initialAppointments: AppointmentWithPatient[];
  rangeFrom: string;
  rangeTo: string;
}) {
  const { data, mutate } = useSWR<AppointmentWithPatient[]>(
    `/api/appointments?from=${encodeURIComponent(rangeFrom)}&to=${encodeURIComponent(rangeTo)}`,
    fetcher,
    { fallbackData: initialAppointments, revalidateOnFocus: false }
  );
  const appointments = React.useMemo(
    () => (data ?? []).map((a) => ({ ...a, dateTime: new Date(a.dateTime) as any })),
    [data]
  );

  const [view, setView] = React.useState<"Day" | "Week" | "Month">("Week");
  const [cursor, setCursor] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState<AppointmentWithPatient | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AppointmentWithPatient | null>(null);
  const [search, setSearch] = React.useState("");

  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const filtered = search.trim()
    ? appointments.filter((a) => a.patient.name.toLowerCase().includes(search.trim().toLowerCase()))
    : appointments;

  function step(dir: 1 | -1) {
    const next = new Date(cursor);
    if (view === "Month") next.setMonth(next.getMonth() + dir);
    else if (view === "Week") next.setDate(next.getDate() + dir * 7);
    else next.setDate(next.getDate() + dir);
    setCursor(next);
  }

  const visibleDays = view === "Day" ? [cursor] : weekDays;

  const rangeLabel =
    view === "Day"
      ? cursor.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" })
      : view === "Week"
      ? `${weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
      : cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  // Month grid cells
  const monthCells = React.useMemo(() => {
    if (view !== "Month") return [];
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const gridStart = startOfWeek(first);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(d.getDate() + i);
      const inMonth = d.getMonth() === cursor.getMonth();
      const dayAppts = filtered.filter((a) => sameDay(new Date(a.dateTime), d));
      return { date: d, inMonth, appts: dayAppts };
    });
  }, [view, cursor, filtered]);

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" subtitle="Live schedule for your clinic" icon={<CalendarDays size={20} />}>
        <div className="flex rounded-xl border p-0.5" style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)" }}>
          {(["Day", "Week", "Month"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors" style={{ background: view === v ? "var(--mf-primary)" : "transparent", color: view === v ? "#fff" : "var(--mf-text-2)" }}>
              {v}
            </button>
          ))}
        </div>
        <button
          className="mf-btn mf-btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Quick Add
        </button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button className="mf-btn mf-btn-outline mf-btn-icon" onClick={() => step(-1)}><ChevronLeft size={16} /></button>
          <button className="mf-btn mf-btn-outline mf-btn-sm" onClick={() => setCursor(new Date())}>Today</button>
          <button className="mf-btn mf-btn-outline mf-btn-icon" onClick={() => step(1)}><ChevronRight size={16} /></button>
        </div>
        <span className="text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>{rangeLabel}</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="mf-input pl-9" placeholder="Search patient…" style={{ width: 200 }} />
          </div>
        </div>
      </div>

      {view !== "Month" ? (
        <div className="mf-card overflow-hidden p-0">
          <div className="overflow-x-auto mf-thin-scroll">
            <div style={{ minWidth: view === "Day" ? 520 : 820 }}>
              <div className="grid border-b" style={{ gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)`, borderColor: "var(--mf-border)" }}>
                <div />
                {visibleDays.map((d, i) => {
                  const isToday = sameDay(d, new Date());
                  return (
                    <div key={i} className="border-l px-2 py-3 text-center" style={{ borderColor: "var(--mf-border)" }}>
                      <p className="text-[11px] font-medium uppercase" style={{ color: isToday ? "var(--mf-primary)" : "var(--mf-text-3)" }}>{DAY_LABELS[(d.getDay() + 6) % 7]}</p>
                      <p className="mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-bold mf-nums" style={{ background: isToday ? "var(--mf-primary)" : "transparent", color: isToday ? "#fff" : "var(--mf-text)" }}>{d.getDate()}</p>
                    </div>
                  );
                })}
              </div>
              <div className="grid" style={{ gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)` }}>
                <div>
                  {HOURS.map((h) => (
                    <div key={h} className="relative text-right" style={{ height: ROW_H }}>
                      <span className="absolute -top-2 right-2 text-[11px] mf-nums" style={{ color: "var(--mf-text-3)" }}>{h}:00</span>
                    </div>
                  ))}
                </div>
                {visibleDays.map((d, di) => {
                  const dayAppts = filtered.filter((a) => sameDay(new Date(a.dateTime), d));
                  const isToday = sameDay(d, new Date());
                  return (
                    <div key={di} className="relative border-l" style={{ borderColor: "var(--mf-border)" }}>
                      {HOURS.map((h) => (
                        <div key={h} className="border-b" style={{ height: ROW_H, borderColor: "var(--mf-border-soft)" }} />
                      ))}
                      {dayAppts.map((a) => (
                        <AppointmentBlock key={a.id} a={a} onClick={() => setSelected(a)} />
                      ))}
                      {isToday && (() => {
                        const now = new Date();
                        const minutes = now.getHours() * 60 + now.getMinutes();
                        if (minutes < START_MIN || minutes > START_MIN + HOURS.length * 60) return null;
                        return (
                          <div className="pointer-events-none absolute left-0 right-0 z-10 flex items-center" style={{ top: ((minutes - START_MIN) / 60) * ROW_H }}>
                            <span className="h-2 w-2 rounded-full" style={{ background: "var(--mf-error)" }} />
                            <span className="h-px flex-1" style={{ background: "var(--mf-error)" }} />
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mf-card grid grid-cols-7 gap-px overflow-hidden p-0" style={{ background: "var(--mf-border)" }}>
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase" style={{ background: "var(--mf-surface)", color: "var(--mf-text-3)" }}>{d}</div>
          ))}
          {monthCells.map((cell, i) => {
            const isToday = sameDay(cell.date, new Date());
            return (
              <button
                key={i}
                onClick={() => {
                  setCursor(cell.date);
                  setView("Day");
                }}
                className="min-h-[92px] p-2 text-left transition-colors hover:bg-[var(--mf-surface-hover)]"
                style={{ background: "var(--mf-surface)" }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold mf-nums" style={{ background: isToday ? "var(--mf-primary)" : "transparent", color: isToday ? "#fff" : cell.inMonth ? "var(--mf-text)" : "var(--mf-text-3)" }}>
                  {cell.date.getDate()}
                </span>
                {cell.inMonth && cell.appts.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {cell.appts.slice(0, 2).map((a) => (
                      <div key={a.id} className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}>
                        {new Date(a.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} {a.patient.name}
                      </div>
                    ))}
                    {cell.appts.length > 2 && <p className="px-1 text-[10px] font-medium" style={{ color: "var(--mf-text-3)" }}>+{cell.appts.length - 2} more</p>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {(Object.keys(REAL_STATUS_META) as Status[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--mf-text-2)" }}>
            <span className="mf-dot" style={{ background: REAL_STATUS_META[s].dot }} /> {REAL_STATUS_META[s].label}
          </span>
        ))}
      </div>

      <Drawer
        a={selected}
        onClose={() => setSelected(null)}
        onMutate={() => mutate()}
        onEdit={() => {
          if (!selected) return;
          setEditing(selected);
          setSelected(null);
          setModalOpen(true);
        }}
      />

      <AppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        appointment={editing}
        defaultDate={view === "Day" ? cursor : new Date()}
        onSaved={() => {
          mutate();
          setModalOpen(false);
        }}
      />
    </div>
  );
}
