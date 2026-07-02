"use client";

import * as React from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Search, Filter, Play, RotateCcw,
  X, Printer, CheckCircle2, Clock, MapPin, Stethoscope, User, Tag, Timer,
} from "lucide-react";
import { appointments, STATUS_META, type Appointment } from "@/lib/medflow/data";
import { Avatar, StatusPill, PageHeader, Pill } from "@/components/medflow/ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [29, 30, 1, 2, 3, 4, 5];
const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8 → 18

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const ROW_H = 60; // px per hour
const START = 8 * 60;

function AppointmentBlock({ a, onClick }: { a: Appointment; onClick: () => void }) {
  const meta = STATUS_META[a.status];
  const top = ((toMin(a.start) - START) / 60) * ROW_H;
  const height = (a.durationMin / 60) * ROW_H - 4;
  return (
    <button
      onClick={onClick}
      className="mf-card-hover absolute left-1 right-1 overflow-hidden rounded-lg border-l-[3px] px-2 py-1.5 text-left transition-all"
      style={{
        top, height, background: meta.bg, borderLeftColor: meta.fg,
        boxShadow: "var(--mf-shadow-sm)",
      }}
    >
      <p className="truncate text-[11.5px] font-semibold leading-tight" style={{ color: meta.fg }}>{a.start} · {a.patient}</p>
      {height > 34 && <p className="truncate text-[11px]" style={{ color: "var(--mf-text-2)" }}>{a.type} · {a.doctor.replace("Dr. ", "Dr ")}</p>}
    </button>
  );
}

function Drawer({ a, onClose }: { a: Appointment | null; onClose: () => void }) {
  if (!a) return null;
  const rows = [
    { icon: <User size={16} />, label: "Patient", value: a.patient },
    { icon: <Stethoscope size={16} />, label: "Doctor", value: a.doctor },
    { icon: <Tag size={16} />, label: "Department", value: a.department },
    { icon: <MapPin size={16} />, label: "Room", value: a.room },
    { icon: <Clock size={16} />, label: "Time", value: `${a.start} · ${a.durationMin} min` },
    { icon: <Timer size={16} />, label: "Visit Type", value: a.type },
  ];
  return (
    <div className="fixed inset-0 z-[65]">
      <div className="mf-animate-fade absolute inset-0" style={{ background: "rgba(2,6,23,0.5)" }} onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l" style={{ background: "var(--mf-surface)", borderColor: "var(--mf-border)", animation: "mf-scale-in 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--mf-border)" }}>
          <div className="flex items-center gap-3">
            <Avatar initials={a.patientAvatar} color={a.patientColor} size={42} />
            <div>
              <p className="text-[15px] font-bold" style={{ color: "var(--mf-text)" }}>{a.patient}</p>
              <StatusPill status={a.status} />
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

          <p className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>Notes</p>
          <div className="mf-card p-4 text-[13px] leading-relaxed" style={{ color: "var(--mf-text-2)" }}>
            Patient reports intermittent chest tightness over the past week. Follow-up ECG requested. No known drug allergies on file.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t p-4" style={{ borderColor: "var(--mf-border)" }}>
          <button className="mf-btn mf-btn-primary col-span-2"><Play size={16} /> Start Consultation</button>
          <button className="mf-btn mf-btn-outline"><RotateCcw size={15} /> Reschedule</button>
          <button className="mf-btn mf-btn-outline"><CheckCircle2 size={15} /> Complete</button>
          <button className="mf-btn mf-btn-outline"><Printer size={15} /> Print</button>
          <button className="mf-btn mf-btn-outline" style={{ color: "var(--mf-error)" }}><X size={15} /> Cancel</button>
        </div>
      </aside>
    </div>
  );
}

export default function AppointmentsPage() {
  const [view, setView] = React.useState<"Day" | "Week" | "Month">("Week");
  const [selected, setSelected] = React.useState<Appointment | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" subtitle="Manage the clinic schedule across all departments" icon={<CalendarDays size={20} />}>
        <div className="flex rounded-xl border p-0.5" style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)" }}>
          {(["Day", "Week", "Month"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors" style={{ background: view === v ? "var(--mf-primary)" : "transparent", color: view === v ? "#fff" : "var(--mf-text-2)" }}>
              {v}
            </button>
          ))}
        </div>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> Quick Add</button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button className="mf-btn mf-btn-outline mf-btn-icon"><ChevronLeft size={16} /></button>
          <button className="mf-btn mf-btn-outline mf-btn-sm">Today</button>
          <button className="mf-btn mf-btn-outline mf-btn-icon"><ChevronRight size={16} /></button>
        </div>
        <span className="text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>Jun 29 – Jul 5, 2026</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
            <input className="mf-input pl-9" placeholder="Search patient…" style={{ width: 200 }} />
          </div>
          <button className="mf-btn mf-btn-outline mf-btn-sm"><Filter size={15} /> Filters</button>
        </div>
      </div>

      {/* Week grid */}
      {view !== "Month" ? (
        <div className="mf-card overflow-hidden p-0">
          <div className="overflow-x-auto mf-thin-scroll">
            <div style={{ minWidth: view === "Day" ? 520 : 820 }}>
              {/* Header row */}
              <div className="grid border-b" style={{ gridTemplateColumns: `56px repeat(${view === "Day" ? 1 : 7}, 1fr)`, borderColor: "var(--mf-border)" }}>
                <div />
                {(view === "Day" ? [3] : DAYS.map((_, i) => i)).map((di) => {
                  const isToday = di === 3;
                  return (
                    <div key={di} className="border-l px-2 py-3 text-center" style={{ borderColor: "var(--mf-border)" }}>
                      <p className="text-[11px] font-medium uppercase" style={{ color: isToday ? "var(--mf-primary)" : "var(--mf-text-3)" }}>{DAYS[di]}</p>
                      <p className="mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-bold mf-nums" style={{ background: isToday ? "var(--mf-primary)" : "transparent", color: isToday ? "#fff" : "var(--mf-text)" }}>{DATES[di]}</p>
                    </div>
                  );
                })}
              </div>
              {/* Body */}
              <div className="grid" style={{ gridTemplateColumns: `56px repeat(${view === "Day" ? 1 : 7}, 1fr)` }}>
                {/* Hours gutter */}
                <div>
                  {HOURS.map((h) => (
                    <div key={h} className="relative text-right" style={{ height: ROW_H }}>
                      <span className="absolute -top-2 right-2 text-[11px] mf-nums" style={{ color: "var(--mf-text-3)" }}>{h}:00</span>
                    </div>
                  ))}
                </div>
                {(view === "Day" ? [3] : DAYS.map((_, i) => i)).map((di) => (
                  <div key={di} className="relative border-l" style={{ borderColor: "var(--mf-border)" }}>
                    {HOURS.map((h) => (
                      <div key={h} className="border-b" style={{ height: ROW_H, borderColor: "var(--mf-border-soft)" }} />
                    ))}
                    {appointments.filter((a) => a.day === di || (view === "Day" && a.day === 3)).map((a) => (
                      <AppointmentBlock key={a.id} a={a} onClick={() => setSelected(a)} />
                    ))}
                    {di === 3 && (
                      <div className="pointer-events-none absolute left-0 right-0 z-10 flex items-center" style={{ top: ((10 * 60 + 20 - START) / 60) * ROW_H }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--mf-error)" }} />
                        <span className="h-px flex-1" style={{ background: "var(--mf-error)" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mf-card grid grid-cols-7 gap-px overflow-hidden p-0" style={{ background: "var(--mf-border)" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase" style={{ background: "var(--mf-surface)", color: "var(--mf-text-3)" }}>{d}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 1;
            const inMonth = day >= 1 && day <= 31;
            const isToday = day === 2;
            const count = [2, 5, 8, 3, 6, 1, 0, 4][i % 8];
            return (
              <div key={i} className="min-h-[92px] p-2" style={{ background: "var(--mf-surface)" }}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold mf-nums" style={{ background: isToday ? "var(--mf-primary)" : "transparent", color: isToday ? "#fff" : inMonth ? "var(--mf-text)" : "var(--mf-text-3)" }}>{inMonth ? day : ""}</span>
                {inMonth && count > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {Array.from({ length: Math.min(count, 2) }).map((_, k) => (
                      <div key={k} className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}>{["Chen", "Reed", "Okafor"][k % 3]} · 9:00</div>
                    ))}
                    {count > 2 && <p className="px-1 text-[10px] font-medium" style={{ color: "var(--mf-text-3)" }}>+{count - 2} more</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-4">
        {(Object.keys(STATUS_META) as (keyof typeof STATUS_META)[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--mf-text-2)" }}>
            <span className="mf-dot" style={{ background: STATUS_META[s].dot }} /> {STATUS_META[s].label}
          </span>
        ))}
      </div>

      <Drawer a={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
