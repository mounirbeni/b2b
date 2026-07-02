"use client";

import * as React from "react";
import {
  Settings, Building2, Clock, Bell, CreditCard, Palette, ShieldCheck, Plug, ScrollText,
  Lock, Database, Check, Upload,
} from "lucide-react";
import { PageHeader, SectionCard, Pill } from "@/components/medflow/ui";

const SECTIONS = [
  { id: "clinic", label: "Clinic Profile", icon: <Building2 size={16} /> },
  { id: "hours", label: "Working Hours", icon: <Clock size={16} /> },
  { id: "notif", label: "Notifications", icon: <Bell size={16} /> },
  { id: "billing", label: "Payment Methods", icon: <CreditCard size={16} /> },
  { id: "brand", label: "Branding", icon: <Palette size={16} /> },
  { id: "roles", label: "Roles & Permissions", icon: <ShieldCheck size={16} /> },
  { id: "api", label: "API Integrations", icon: <Plug size={16} /> },
  { id: "audit", label: "Audit Logs", icon: <ScrollText size={16} /> },
  { id: "security", label: "Security", icon: <Lock size={16} /> },
  { id: "backup", label: "Backup", icon: <Database size={16} /> },
];

function Toggle({ on = false, label, desc }: { on?: boolean; label: string; desc: string }) {
  const [v, setV] = React.useState(on);
  return (
    <div className="flex items-center gap-3 border-t py-3.5 first:border-t-0" style={{ borderColor: "var(--mf-border-soft)" }}>
      <div className="flex-1"><p className="text-[13.5px] font-medium" style={{ color: "var(--mf-text)" }}>{label}</p><p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{desc}</p></div>
      <button onClick={() => setV(!v)} className="relative h-6 w-11 shrink-0 rounded-full transition-colors" style={{ background: v ? "var(--mf-primary)" : "var(--mf-border)" }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: v ? 22 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = React.useState("clinic");
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure your clinic, branding and integrations" icon={<Settings size={20} />} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <div className="mf-card h-fit p-2">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors" style={{ color: active === s.id ? "var(--mf-primary)" : "var(--mf-text-2)", background: active === s.id ? "var(--mf-primary-soft)" : "transparent" }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {active === "notif" ? (
            <SectionCard title="Notifications" subtitle="Choose what you get notified about">
              <Toggle on label="Appointment confirmations" desc="Notify when a patient confirms or reschedules" />
              <Toggle on label="New patient registration" desc="Alert front desk on walk-in registrations" />
              <Toggle label="Lab results ready" desc="Notify the ordering physician automatically" />
              <Toggle on label="Payment received" desc="Send a receipt and notify billing" />
              <Toggle label="Low stock alerts" desc="Warn when items drop below reorder point" />
            </SectionCard>
          ) : active === "brand" ? (
            <SectionCard title="Branding" subtitle="Make MedFlow feel like your clinic">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl mf-brand-gradient text-white text-2xl font-bold">R</span>
                <button className="mf-btn mf-btn-outline"><Upload size={15} /> Upload Logo</button>
              </div>
              <p className="mb-2 mt-5 text-[13px] font-medium" style={{ color: "var(--mf-text)" }}>Accent color</p>
              <div className="flex gap-2.5">
                {["#2563eb", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#0ea5e9"].map((c, i) => (
                  <button key={c} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: c, boxShadow: i === 0 ? "0 0 0 2px var(--mf-surface), 0 0 0 4px " + c : "none" }}>{i === 0 && <Check size={16} className="text-white" />}</button>
                ))}
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="Clinic Profile" subtitle="Basic information about your clinic">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[["Clinic name", "Riverside Medical Center"], ["Phone", "+1 415 555 0100"], ["Email", "hello@riverside.health"], ["License #", "CA-CLINIC-88213"]].map(([l, v]) => (
                  <div key={l}><label className="mb-1.5 block text-[12px] font-medium" style={{ color: "var(--mf-text-2)" }}>{l}</label><input defaultValue={v} className="mf-input" /></div>
                ))}
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[12px] font-medium" style={{ color: "var(--mf-text-2)" }}>Address</label><input defaultValue="482 Riverside Ave, San Francisco, CA 94102" className="mf-input" /></div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Pill tone="success" dot>Verified clinic</Pill>
                <button className="mf-btn mf-btn-primary ml-auto"><Check size={16} /> Save Changes</button>
              </div>
            </SectionCard>
          )}

          <SectionCard title="Working Hours" subtitle="Set availability per day" bodyClassName="space-y-0">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d, i) => (
              <div key={d} className="flex items-center gap-4 border-t py-3 first:border-t-0" style={{ borderColor: "var(--mf-border-soft)" }}>
                <span className="w-24 text-[13.5px] font-medium" style={{ color: "var(--mf-text)" }}>{d}</span>
                {i < 6 ? (
                  <span className="text-[13px] mf-nums" style={{ color: "var(--mf-text-2)" }}>{i < 5 ? "08:00 – 18:00" : "09:00 – 14:00"}</span>
                ) : (
                  <Pill tone="neutral">Closed</Pill>
                )}
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
