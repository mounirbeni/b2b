"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Phone, Mail, MapPin, Calendar, Droplet, ShieldCheck, Pencil,
  MessageSquare, Plus, Activity, HeartPulse, Thermometer, Wind, Pill, FlaskConical,
  FileText, AlertTriangle, CheckCircle2, Clock, Stethoscope, CalendarPlus,
} from "lucide-react";
import { patients } from "@/lib/medflow/data";
import { Avatar, Card, SectionCard, Pill as Chip, StatusPill, ProgressBar } from "@/components/medflow/ui";

const TABS = ["Overview", "Timeline", "Visits", "Diagnoses", "Medications", "Lab Results", "Invoices", "Documents"];

const VITALS = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: <HeartPulse size={16} />, tone: "var(--mf-error)", pct: 60 },
  { label: "Blood Pressure", value: "118/76", unit: "mmHg", icon: <Activity size={16} />, tone: "var(--mf-primary)", pct: 72 },
  { label: "Temperature", value: "36.8", unit: "°C", icon: <Thermometer size={16} />, tone: "var(--mf-warning)", pct: 55 },
  { label: "SpO₂", value: "98", unit: "%", icon: <Wind size={16} />, tone: "var(--mf-secondary)", pct: 98 },
];

const TIMELINE = [
  { icon: <Stethoscope size={14} />, tone: "primary", title: "Cardiology Consultation", desc: "Dr. Sarah Chen · Follow-up for hypertension", time: "Jun 28, 2026" },
  { icon: <FlaskConical size={14} />, tone: "info", title: "Lipid Panel — Completed", desc: "LDL slightly elevated, recommended diet change", time: "Jun 20, 2026" },
  { icon: <Pill size={14} />, tone: "success", title: "Prescription Issued", desc: "Atorvastatin 20mg · 30 days", time: "Jun 20, 2026" },
  { icon: <CheckCircle2 size={14} />, tone: "success", title: "Annual Check-up", desc: "All vitals within normal range", time: "Mar 12, 2026" },
];

const TONE: Record<string, { fg: string; bg: string }> = {
  primary: { fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)" },
  success: { fg: "var(--mf-success)", bg: "var(--mf-success-soft)" },
  info: { fg: "var(--mf-info)", bg: "var(--mf-info-soft)" },
};

export default function PatientProfile() {
  const params = useParams();
  const patient = patients.find((p) => p.id === params.id) ?? patients[0];
  const [tab, setTab] = React.useState("Overview");

  return (
    <div className="space-y-6">
      <Link href="/medflow/patients" className="inline-flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--mf-text-2)" }}>
        <ChevronLeft size={16} /> Back to patients
      </Link>

      {/* Profile header */}
      <div className="mf-animate-in relative overflow-hidden rounded-3xl border p-6" style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)" }}>
        <div className="absolute inset-x-0 top-0 h-24 mf-brand-gradient opacity-90" />
        <div className="relative flex flex-col gap-5 pt-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div style={{ boxShadow: "0 0 0 4px var(--mf-surface)" }} className="rounded-full">
              <Avatar initials={patient.avatar} color={patient.color} size={84} />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[24px] font-bold tracking-tight" style={{ color: "var(--mf-text)" }}>{patient.name}</h1>
                <StatusPill status={patient.status} live={patient.status === "in-consultation"} />
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                <span>{patient.mrn}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> {patient.age} yrs · {patient.gender}</span>
                <span className="flex items-center gap-1"><Droplet size={13} /> {patient.blood}</span>
                <span className="flex items-center gap-1"><ShieldCheck size={13} /> {patient.insurance}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="mf-btn mf-btn-outline"><MessageSquare size={16} /> Message</button>
            <button className="mf-btn mf-btn-outline"><Pencil size={16} /> Edit</button>
            <button className="mf-btn mf-btn-primary"><CalendarPlus size={16} /> Book Visit</button>
          </div>
        </div>
      </div>

      {/* Allergy banner */}
      <div className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: "color-mix(in srgb, var(--mf-warning) 35%, var(--mf-border))", background: "var(--mf-warning-soft)" }}>
        <AlertTriangle size={18} style={{ color: "var(--mf-warning)" }} />
        <span className="text-[13px] font-medium" style={{ color: "var(--mf-text)" }}>Known allergies:</span>
        <Chip tone="error">Penicillin</Chip>
        <Chip tone="warning">Pollen</Chip>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b mf-thin-scroll" style={{ borderColor: "var(--mf-border)" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="relative whitespace-nowrap px-3.5 py-2.5 text-[13.5px] font-medium transition-colors" style={{ color: tab === t ? "var(--mf-primary)" : "var(--mf-text-2)" }}>
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full" style={{ background: "var(--mf-primary)" }} />}
          </button>
        ))}
      </div>

      {tab === "Timeline" ? (
        <SectionCard title="Medical Timeline" bodyClassName="px-5">
          <div className="relative space-y-5 border-l pl-6" style={{ borderColor: "var(--mf-border)" }}>
            {TIMELINE.map((e, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full" style={{ ...TONE[e.tone] && { color: TONE[e.tone].fg, background: TONE[e.tone].bg }, boxShadow: "0 0 0 3px var(--mf-surface)" }}>{e.icon}</span>
                <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{e.title}</p>
                <p className="text-[13px]" style={{ color: "var(--mf-text-2)" }}>{e.desc}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--mf-text-3)" }}>{e.time}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Vitals */}
            <SectionCard title="Latest Vitals" subtitle="Recorded Jun 28, 2026" action={<Chip tone="success" dot>Stable</Chip>}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {VITALS.map((v) => (
                  <div key={v.label} className="mf-card p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ color: v.tone, background: `color-mix(in srgb, ${v.tone} 14%, transparent)` }}>{v.icon}</span>
                    <p className="mt-2.5 text-[20px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{v.value} <span className="text-[12px] font-medium" style={{ color: "var(--mf-text-3)" }}>{v.unit}</span></p>
                    <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{v.label}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Medications */}
            <SectionCard title="Active Medications" action={<button className="mf-btn mf-btn-ghost mf-btn-sm"><Plus size={14} /> Add</button>} bodyClassName="space-y-2.5">
              {[
                { name: "Atorvastatin 20mg", freq: "Once daily · evening", tone: "primary" },
                { name: "Amlodipine 5mg", freq: "Once daily · morning", tone: "info" },
                { name: "Aspirin 81mg", freq: "Once daily", tone: "success" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5" style={{ borderColor: "var(--mf-border)" }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}><Pill size={16} /></span>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{m.name}</p>
                    <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{m.freq}</p>
                  </div>
                  <Chip tone="success" dot>Active</Chip>
                </div>
              ))}
            </SectionCard>
          </div>

          {/* Right rail */}
          <div className="space-y-6">
            <SectionCard title="Contact" bodyClassName="space-y-3">
              {[
                { icon: <Phone size={15} />, value: patient.phone },
                { icon: <Mail size={15} />, value: `${patient.name.split(" ")[0].toLowerCase()}@email.com` },
                { icon: <MapPin size={15} />, value: "482 Riverside Ave, San Francisco" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                  <span style={{ color: "var(--mf-text-3)" }}>{c.icon}</span> {c.value}
                </div>
              ))}
            </SectionCard>

            <SectionCard title="Care Summary" bodyClassName="space-y-3.5">
              {[
                { label: "Treatment adherence", value: 92, color: "var(--mf-success)" },
                { label: "Appointment attendance", value: 88, color: "var(--mf-primary)" },
                { label: "Risk score", value: 24, color: "var(--mf-warning)" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex justify-between text-[13px]"><span style={{ color: "var(--mf-text-2)" }}>{s.label}</span><span className="font-semibold mf-nums" style={{ color: "var(--mf-text)" }}>{s.value}%</span></div>
                  <ProgressBar value={s.value} color={s.color} />
                </div>
              ))}
            </SectionCard>

            <div className="relative overflow-hidden rounded-2xl border p-4" style={{ borderColor: "var(--mf-border)", background: "var(--mf-primary-soft)" }}>
              <div className="absolute inset-0 mf-mesh opacity-70" />
              <div className="relative">
                <p className="text-[13px] font-semibold" style={{ color: "var(--mf-primary)" }}>✦ AI Patient Summary</p>
                <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--mf-text-2)" }}>Stable hypertensive patient, well-controlled on current regimen. Lipids trending down. Recommend follow-up ECG in 3 months.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
