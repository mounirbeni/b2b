"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Zap, Phone, Play, Search, AlertTriangle } from "lucide-react";
import type { AppointmentWithPatient, Status } from "@/types";
import { RealStatusPill } from "@/lib/medflow/real-status";
import { Avatar, SectionCard } from "@/components/medflow/ui";
import { initialsOf, colorFor } from "@/lib/medflow/live";

export function ReceptionQueue({ initialQueue }: { initialQueue: AppointmentWithPatient[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: "", phone: "", age: "", gender: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const queue = initialQueue.filter((a) => a.patient.name.toLowerCase().includes(search.trim().toLowerCase()));
  const urgent = queue.filter((a) => a.type === "URGENT" && a.status !== "IN_PROGRESS");
  const rest = queue.filter((a) => !urgent.includes(a));

  async function startConsultation(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Consultation started");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    } finally {
      setBusyId(null);
    }
  }

  async function registerWalkIn(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      const birthDate = form.age
        ? new Date(new Date().getFullYear() - Number(form.age), 0, 1).toISOString().slice(0, 10)
        : "";
      const patientRes = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          birthDate,
          gender: form.gender || undefined,
        }),
      });
      const patient = await patientRes.json();
      if (!patientRes.ok) throw new Error(patient.error ?? "Failed to register patient");

      const now = new Date();
      const apptRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          date: now.toISOString().slice(0, 10),
          time: now.toTimeString().slice(0, 5),
          duration: 30,
          type: "CONSULTATION",
          status: "WAITING",
        }),
      });
      const appt = await apptRes.json();
      if (!apptRes.ok) throw new Error(appt.error ?? "Failed to add to queue");

      toast.success("Patient registered and added to queue");
      setForm({ name: "", phone: "", age: "", gender: "" });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {urgent.length > 0 && (
          <div className="mf-card overflow-hidden p-0" style={{ borderColor: "color-mix(in srgb, var(--mf-error) 40%, var(--mf-border))" }}>
            <div className="flex items-center gap-2 px-5 py-3.5" style={{ background: "var(--mf-error-soft)" }}>
              <AlertTriangle size={17} style={{ color: "var(--mf-error)" }} />
              <span className="text-[14px] font-bold" style={{ color: "var(--mf-error)" }}>Urgent</span>
              <span className="mf-chip ml-auto" style={{ background: "var(--mf-error)", color: "#fff" }}>{urgent.length}</span>
            </div>
            {urgent.map((a) => (
              <QueueRow key={a.id} a={a} busy={busyId === a.id} onStart={() => startConsultation(a.id)} urgent />
            ))}
          </div>
        )}

        <SectionCard
          title="Today's Queue"
          subtitle="Ordered by scheduled time"
          action={
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="mf-input mf-btn-sm h-8 pl-8 text-[13px]" placeholder="Find patient…" style={{ width: 160 }} />
            </div>
          }
          bodyClassName="px-0 pb-0"
        >
          {rest.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No one in the queue right now.</p>
          ) : (
            rest.map((a) => <QueueRow key={a.id} a={a} busy={busyId === a.id} onStart={() => startConsultation(a.id)} />)
          )}
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="Quick Registration" subtitle="Register a walk-in and add to today's queue">
          <form className="space-y-3" onSubmit={registerWalkIn}>
            <input className="mf-input" placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <input className="mf-input" placeholder="Phone number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="mf-input" placeholder="Age" type="number" min={0} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
              <select className="mf-input" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                <option value="">Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="mf-btn mf-btn-primary w-full">
              <Zap size={16} /> {submitting ? "Registering…" : "Register & Add to Queue"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

function QueueRow({ a, busy, onStart, urgent }: { a: AppointmentWithPatient; busy: boolean; onStart: () => void; urgent?: boolean }) {
  const dt = new Date(a.dateTime);
  return (
    <div className="flex items-center gap-3 border-t px-5 py-3 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
      <span className="text-[12px] font-semibold mf-nums" style={{ color: "var(--mf-text-3)", width: 44 }}>
        {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </span>
      <Avatar initials={initialsOf(a.patient.name)} color={colorFor(a.patientId)} size={38} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{a.patient.name}</p>
        <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{a.type}{urgent ? " · Urgent" : ""}</p>
      </div>
      {a.status === "IN_PROGRESS" ? (
        <RealStatusPill status="IN_PROGRESS" live />
      ) : (
        <>
          <a href={`tel:${a.patient.phone}`} className="mf-btn mf-btn-outline mf-btn-icon"><Phone size={15} /></a>
          <button disabled={busy} onClick={onStart} className="mf-btn mf-btn-primary mf-btn-sm">
            <Play size={14} /> Start
          </button>
        </>
      )}
    </div>
  );
}
