"use client";

import * as React from "react";
import {
  ClipboardList, HeartPulse, Activity, Thermometer, Wind, AlertTriangle, Mic, Paperclip,
  Sparkles, Pill, FlaskConical, Scan, FileCheck, CalendarPlus, Building2, Clock,
  ChevronRight, Save, Play, User,
} from "lucide-react";
import { Avatar, SectionCard, Pill as Chip } from "@/components/medflow/ui";

const VITALS = [
  { label: "HR", value: "72", icon: <HeartPulse size={14} />, tone: "var(--mf-error)" },
  { label: "BP", value: "118/76", icon: <Activity size={14} />, tone: "var(--mf-primary)" },
  { label: "Temp", value: "36.8°", icon: <Thermometer size={14} />, tone: "var(--mf-warning)" },
  { label: "SpO₂", value: "98%", icon: <Wind size={14} />, tone: "var(--mf-secondary)" },
];

const SOAP = ["Subjective", "Objective", "Assessment", "Plan"];

const QUICK = [
  { label: "Prescription", icon: <Pill size={16} />, tone: "primary" },
  { label: "Lab Request", icon: <FlaskConical size={16} />, tone: "info" },
  { label: "Radiology", icon: <Scan size={16} />, tone: "info" },
  { label: "Medical Certificate", icon: <FileCheck size={16} />, tone: "success" },
  { label: "Follow-up", icon: <CalendarPlus size={16} />, tone: "primary" },
  { label: "Referral", icon: <Building2 size={16} />, tone: "warning" },
];

const TONE: Record<string, { fg: string; bg: string }> = {
  primary: { fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)" },
  success: { fg: "var(--mf-success)", bg: "var(--mf-success-soft)" },
  warning: { fg: "var(--mf-warning)", bg: "var(--mf-warning-soft)" },
  info: { fg: "var(--mf-info)", bg: "var(--mf-info-soft)" },
};

export default function ConsultationsPage() {
  const [soap, setSoap] = React.useState("Subjective");
  const [notes, setNotes] = React.useState(
    "Patient presents with intermittent chest tightness over the past week, worse on exertion, relieved by rest. Denies radiation, dyspnea, or palpitations. No syncope."
  );

  return (
    <div className="space-y-5">
      {/* Session bar */}
      <div className="mf-card flex flex-wrap items-center gap-3 px-5 py-3.5">
        <Avatar initials="EF" color="#2563eb" size={44} />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-bold" style={{ color: "var(--mf-text)" }}>Elena Fisher</p>
            <Chip tone="primary" dot>In Consultation</Chip>
          </div>
          <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>34 yrs · Female · MRN-10432 · Cardiology · Room 203</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] font-semibold mf-nums" style={{ borderColor: "var(--mf-border)", color: "var(--mf-primary)" }}>
            <Clock size={15} /> 14:32
          </div>
          <button className="mf-btn mf-btn-outline"><Save size={16} /> Save Draft</button>
          <button className="mf-btn mf-btn-primary"><FileCheck size={16} /> Complete Visit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_300px]">
        {/* LEFT — patient context */}
        <div className="space-y-5">
          <SectionCard title="Vitals" action={<Chip tone="success" dot>Stable</Chip>} bodyClassName="grid grid-cols-2 gap-3">
            {VITALS.map((v) => (
              <div key={v.label} className="rounded-xl border p-3" style={{ borderColor: "var(--mf-border)" }}>
                <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--mf-text-2)" }}><span style={{ color: v.tone }}>{v.icon}</span> {v.label}</span>
                <p className="mt-1 text-[17px] font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{v.value}</p>
              </div>
            ))}
          </SectionCard>

          <div className="rounded-2xl border px-4 py-3" style={{ borderColor: "color-mix(in srgb, var(--mf-error) 30%, var(--mf-border))", background: "var(--mf-error-soft)" }}>
            <p className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--mf-error)" }}><AlertTriangle size={15} /> Allergies</p>
            <div className="mt-2 flex flex-wrap gap-1.5"><Chip tone="error">Penicillin</Chip><Chip tone="warning">Pollen</Chip></div>
          </div>

          <SectionCard title="Medical History" bodyClassName="space-y-2.5">
            {["Hypertension — since 2021", "Hyperlipidemia — since 2023", "Appendectomy — 2015"].map((h) => (
              <div key={h} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--mf-primary)" }} /> {h}
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Previous Visits" bodyClassName="space-y-2">
            {[{ d: "Jun 28", t: "Follow-up" }, { d: "Mar 12", t: "Check-up" }, { d: "Jan 04", t: "ECG" }].map((v) => (
              <button key={v.d} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--mf-surface-hover)]">
                <span className="text-[13px] font-medium mf-nums" style={{ color: "var(--mf-text)" }}>{v.d}</span>
                <span className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{v.t}</span>
                <ChevronRight size={14} className="ml-auto" style={{ color: "var(--mf-text-3)" }} />
              </button>
            ))}
          </SectionCard>
        </div>

        {/* CENTER — clinical notes */}
        <div className="space-y-5">
          <div className="mf-card overflow-hidden p-0">
            <div className="flex items-center gap-1 border-b p-2" style={{ borderColor: "var(--mf-border)" }}>
              {SOAP.map((s) => (
                <button key={s} onClick={() => setSoap(s)} className="flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors" style={{ background: soap === s ? "var(--mf-primary-soft)" : "transparent", color: soap === s ? "var(--mf-primary)" : "var(--mf-text-2)" }}>
                  {s}
                </button>
              ))}
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{soap} Notes</p>
                <div className="flex items-center gap-1.5">
                  <button className="mf-btn mf-btn-ghost mf-btn-sm"><Mic size={14} /> Dictate</button>
                  <button className="mf-btn mf-btn-sm" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}><Sparkles size={14} /> AI Assist</button>
                </div>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full resize-none rounded-xl border bg-transparent p-3.5 text-[14px] leading-relaxed outline-none focus:border-[var(--mf-primary)]"
                style={{ borderColor: "var(--mf-border)", color: "var(--mf-text)", minHeight: 180 }}
              />
              <div className="mt-2 flex items-center gap-2">
                <button className="mf-btn mf-btn-ghost mf-btn-sm"><Paperclip size={14} /> Attach</button>
                <span className="ml-auto text-[12px]" style={{ color: "var(--mf-text-3)" }}>Auto-saved · just now</span>
              </div>
            </div>
          </div>

          <SectionCard title="Diagnosis" action={<button className="mf-btn mf-btn-ghost mf-btn-sm"><Sparkles size={14} style={{ color: "var(--mf-primary)" }} /> Suggest</button>}>
            <div className="flex flex-wrap gap-2">
              <Chip tone="primary">I20.9 — Angina pectoris</Chip>
              <Chip tone="neutral">I10 — Essential hypertension</Chip>
              <button className="mf-chip" style={{ border: "1px dashed var(--mf-border)", color: "var(--mf-text-2)" }}>+ Add diagnosis</button>
            </div>
          </SectionCard>

          <SectionCard title="Treatment Plan">
            <textarea
              defaultValue={"1. Order resting ECG and cardiac enzymes.\n2. Continue Atorvastatin 20mg, add sublingual nitroglycerin PRN.\n3. Lifestyle counseling — low-sodium diet, moderate exercise.\n4. Follow-up in 2 weeks with results."}
              className="w-full resize-none rounded-xl border bg-transparent p-3.5 text-[14px] leading-relaxed outline-none focus:border-[var(--mf-primary)]"
              style={{ borderColor: "var(--mf-border)", color: "var(--mf-text)", minHeight: 110 }}
            />
          </SectionCard>
        </div>

        {/* RIGHT — quick actions */}
        <div className="space-y-5">
          <SectionCard title="Quick Actions" bodyClassName="grid grid-cols-1 gap-2.5">
            {QUICK.map((q) => {
              const t = TONE[q.tone];
              return (
                <button key={q.label} className="mf-card-hover flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left" style={{ borderColor: "var(--mf-border)" }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ color: t.fg, background: t.bg }}>{q.icon}</span>
                  <span className="text-[13.5px] font-semibold" style={{ color: "var(--mf-text)" }}>{q.label}</span>
                  <ChevronRight size={15} className="ml-auto" style={{ color: "var(--mf-text-3)" }} />
                </button>
              );
            })}
          </SectionCard>

          <div className="relative overflow-hidden rounded-2xl border p-4" style={{ borderColor: "var(--mf-border)", background: "var(--mf-primary-soft)" }}>
            <div className="absolute inset-0 mf-mesh opacity-70" />
            <div className="relative">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--mf-primary)" }}><Sparkles size={15} /> AI Clinical Support</p>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--mf-text-2)" }}>Symptoms + history suggest evaluating for stable angina. Consider ECG & troponin. Drug interaction check: clear.</p>
              <button className="mf-btn mf-btn-primary mf-btn-sm mt-3 w-full">Generate Note Draft</button>
            </div>
          </div>

          <SectionCard title="Voice Notes" bodyClassName="space-y-2.5">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-[13px] font-medium transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border)", color: "var(--mf-text-2)" }}>
              <Mic size={16} /> Tap to record
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
