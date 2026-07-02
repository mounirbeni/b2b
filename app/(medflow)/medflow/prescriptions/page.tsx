"use client";

import * as React from "react";
import {
  Pill, Search, Plus, Trash2, Printer, Send, FileDown, Sparkles, Stethoscope, X, Check,
} from "lucide-react";
import { medicines } from "@/lib/medflow/data";
import { Avatar, PageHeader, SectionCard, Pill as Chip } from "@/components/medflow/ui";

type Rx = { id: number; name: string; dosage: string; freq: string; duration: string; instr: string };

let counter = 3;

export default function PrescriptionsPage() {
  const [items, setItems] = React.useState<Rx[]>([
    { id: 1, name: "Atorvastatin 20mg", dosage: "1 tablet", freq: "Once daily", duration: "30 days", instr: "Take in the evening" },
    { id: 2, name: "Amlodipine 5mg", dosage: "1 tablet", freq: "Once daily", duration: "30 days", instr: "With food" },
  ]);
  const [query, setQuery] = React.useState("");
  const suggestions = query ? medicines.filter((m) => m.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];

  const add = (name: string) => {
    setItems((p) => [...p, { id: counter++, name, dosage: "1 tablet", freq: "Once daily", duration: "7 days", instr: "" }]);
    setQuery("");
  };
  const remove = (id: number) => setItems((p) => p.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <PageHeader title="Prescription Builder" subtitle="Generate professional, signed prescriptions" icon={<Pill size={20} />}>
        <button className="mf-btn mf-btn-outline"><FileDown size={16} /> Export PDF</button>
        <button className="mf-btn mf-btn-primary"><Send size={16} /> Send to Patient</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Builder */}
        <div className="space-y-5 lg:col-span-2">
          <SectionCard title="Add Medication" subtitle="Search with autocomplete">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="mf-input pl-9" placeholder="Type a medicine name…" />
              {suggestions.length > 0 && (
                <div className="mf-card mf-animate-scale absolute left-0 right-0 top-12 z-20 overflow-hidden p-1.5" style={{ boxShadow: "var(--mf-shadow-lg)" }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => add(s)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ color: "var(--mf-text)" }}>
                      <Pill size={15} style={{ color: "var(--mf-primary)" }} /> {s}
                      <Plus size={15} className="ml-auto" style={{ color: "var(--mf-text-3)" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={it.id} className="mf-card p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}><Pill size={17} /></span>
                  <p className="text-[15px] font-bold" style={{ color: "var(--mf-text)" }}>{it.name}</p>
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}>{i + 1}</span>
                  <button onClick={() => remove(it.id)} className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8" style={{ color: "var(--mf-error)" }}><Trash2 size={15} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[["Dosage", it.dosage], ["Frequency", it.freq], ["Duration", it.duration]].map(([l, v]) => (
                    <div key={l}>
                      <label className="mb-1 block text-[11px] font-medium" style={{ color: "var(--mf-text-3)" }}>{l}</label>
                      <input defaultValue={v as string} className="mf-input mf-btn-sm h-9 text-[13px]" />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-[11px] font-medium" style={{ color: "var(--mf-text-3)" }}>Refills</label>
                    <select className="mf-input mf-btn-sm h-9 text-[13px]"><option>0</option><option>1</option><option>2</option><option>3</option></select>
                  </div>
                </div>
                <input defaultValue={it.instr} placeholder="Special instructions…" className="mf-input mf-btn-sm mt-3 h-9 text-[13px]" />
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl border p-4" style={{ borderColor: "var(--mf-border)", background: "var(--mf-primary-soft)" }}>
            <div className="absolute inset-0 mf-mesh opacity-70" />
            <div className="relative flex items-center gap-3">
              <Sparkles size={18} style={{ color: "var(--mf-primary)" }} />
              <p className="flex-1 text-[13px]" style={{ color: "var(--mf-text-2)" }}>AI suggests adding <b style={{ color: "var(--mf-text)" }}>Aspirin 81mg</b> for cardioprotection. No interactions detected.</p>
              <button className="mf-btn mf-btn-sm" style={{ background: "var(--mf-primary)", color: "#fff" }} onClick={() => add("Aspirin 81mg")}><Check size={14} /> Add</button>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <div className="mf-card sticky top-24 overflow-hidden p-0">
            <div className="mf-brand-gradient flex items-center gap-3 p-5 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20"><Stethoscope size={20} /></span>
              <div>
                <p className="text-[15px] font-bold">Riverside Medical</p>
                <p className="text-[12px] opacity-90">482 Riverside Ave · SF</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--mf-border)" }}>
                <Avatar initials="EF" color="#2563eb" size={40} />
                <div><p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>Elena Fisher</p><p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>34 yrs · MRN-10432</p></div>
                <span className="ml-auto text-[12px] mf-nums" style={{ color: "var(--mf-text-3)" }}>Jul 2, 2026</span>
              </div>
              <p className="my-3 text-[22px] font-serif italic" style={{ color: "var(--mf-primary)" }}>℞</p>
              <div className="space-y-3">
                {items.map((it, i) => (
                  <div key={it.id} className="text-[13px]">
                    <p className="font-semibold" style={{ color: "var(--mf-text)" }}>{i + 1}. {it.name}</p>
                    <p style={{ color: "var(--mf-text-2)" }}>{it.dosage} · {it.freq} · {it.duration}{it.instr ? ` · ${it.instr}` : ""}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--mf-border)" }}>
                <p className="font-serif text-[18px] italic" style={{ color: "var(--mf-text)" }}>Dr. Sarah Chen</p>
                <p className="text-[12px]" style={{ color: "var(--mf-text-3)" }}>Cardiologist · Lic. #CA-88213</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="mf-btn mf-btn-outline mf-btn-sm"><Printer size={14} /> Print</button>
                <button className="mf-btn mf-btn-primary mf-btn-sm"><FileDown size={14} /> PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
