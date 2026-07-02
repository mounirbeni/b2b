"use client";

import * as React from "react";
import {
  MessageSquare, Search, Send, Phone, Mail, Smartphone, Plus, Sparkles, Paperclip, Zap,
} from "lucide-react";
import { PageHeader, Avatar, Pill, SectionCard } from "@/components/medflow/ui";

const CHANNELS = [
  { label: "SMS", icon: <Smartphone size={14} />, tone: "primary" as const },
  { label: "WhatsApp", icon: <MessageSquare size={14} />, tone: "success" as const },
  { label: "Email", icon: <Mail size={14} />, tone: "info" as const },
];

const THREADS = [
  { name: "Elena Fisher", av: "EF", c: "#2563eb", last: "Thank you, see you Thursday!", time: "2m", unread: 2, channel: "SMS" },
  { name: "James Sullivan", av: "JS", c: "#10b981", last: "Are my lab results ready?", time: "18m", unread: 1, channel: "WhatsApp" },
  { name: "Maria Gonzalez", av: "MG", c: "#ec4899", last: "Reschedule to next week please", time: "1h", unread: 0, channel: "Email" },
  { name: "David Park", av: "DP", c: "#0ea5e9", last: "Payment confirmed ✔", time: "3h", unread: 0, channel: "SMS" },
];

const MSGS = [
  { me: false, text: "Hi, I'd like to confirm my appointment for Thursday.", time: "9:02 AM" },
  { me: true, text: "Hello Elena! Yes, you're confirmed with Dr. Chen on Thursday, July 2 at 9:00 AM, Room 203.", time: "9:04 AM" },
  { me: false, text: "Perfect. Should I fast before the visit?", time: "9:05 AM" },
  { me: true, text: "No fasting needed for this follow-up. Please bring your current medications list.", time: "9:06 AM" },
  { me: false, text: "Thank you, see you Thursday!", time: "9:07 AM" },
];

const TEMPLATES = ["Appointment reminder", "Lab results ready", "Follow-up reminder", "Birthday wishes", "Payment receipt"];

export default function MessagesPage() {
  const [active, setActive] = React.useState(0);
  return (
    <div className="space-y-6">
      <PageHeader title="Messaging Center" subtitle="SMS, WhatsApp & Email with automation" icon={<MessageSquare size={20} />}>
        <button className="mf-btn mf-btn-outline"><Zap size={16} /> Automations</button>
        <button className="mf-btn mf-btn-primary"><Plus size={16} /> Broadcast</button>
      </PageHeader>

      <div className="mf-card grid grid-cols-1 overflow-hidden p-0 md:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr_260px]" style={{ height: "68vh", minHeight: 520 }}>
        {/* Threads */}
        <div className="flex flex-col border-r" style={{ borderColor: "var(--mf-border)" }}>
          <div className="border-b p-3" style={{ borderColor: "var(--mf-border)" }}>
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} /><input className="mf-input pl-9" placeholder="Search conversations…" /></div>
          </div>
          <div className="flex-1 overflow-y-auto mf-thin-scroll">
            {THREADS.map((t, i) => (
              <button key={t.name} onClick={() => setActive(i)} className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors" style={{ borderColor: "var(--mf-border-soft)", background: active === i ? "var(--mf-surface-hover)" : "transparent" }}>
                <Avatar initials={t.av} color={t.c} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="truncate text-[13.5px] font-semibold" style={{ color: "var(--mf-text)" }}>{t.name}</p><span className="ml-auto text-[11px]" style={{ color: "var(--mf-text-3)" }}>{t.time}</span></div>
                  <p className="truncate text-[12px]" style={{ color: "var(--mf-text-2)" }}>{t.last}</p>
                </div>
                {t.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--mf-primary)" }}>{t.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b px-5 py-3" style={{ borderColor: "var(--mf-border)" }}>
            <Avatar initials={THREADS[active].av} color={THREADS[active].c} size={38} />
            <div><p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{THREADS[active].name}</p><p className="text-[11px]" style={{ color: "var(--mf-text-2)" }}>via {THREADS[active].channel}</p></div>
            <div className="ml-auto flex gap-1"><button className="mf-btn mf-btn-ghost mf-btn-icon"><Phone size={16} /></button><button className="mf-btn mf-btn-ghost mf-btn-icon"><Mail size={16} /></button></div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 mf-thin-scroll">
            {MSGS.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[78%] rounded-2xl px-3.5 py-2.5" style={{ background: m.me ? "var(--mf-primary)" : "var(--mf-surface-2)", color: m.me ? "#fff" : "var(--mf-text)", borderBottomRightRadius: m.me ? 4 : 16, borderBottomLeftRadius: m.me ? 16 : 4 }}>
                  <p className="text-[13.5px] leading-relaxed">{m.text}</p>
                  <p className="mt-1 text-[10px]" style={{ color: m.me ? "rgba(255,255,255,0.7)" : "var(--mf-text-3)" }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-3" style={{ borderColor: "var(--mf-border)" }}>
            <div className="mb-2 flex gap-1.5">{CHANNELS.map((c) => <Pill key={c.label} tone={c.tone}>{c.icon} {c.label}</Pill>)}</div>
            <div className="flex items-center gap-2">
              <button className="mf-btn mf-btn-ghost mf-btn-icon"><Paperclip size={17} /></button>
              <input className="mf-input flex-1" placeholder="Type a message…" />
              <button className="mf-btn mf-btn-primary mf-btn-icon"><Send size={16} /></button>
            </div>
          </div>
        </div>

        {/* Templates rail */}
        <div className="hidden flex-col border-l lg:flex" style={{ borderColor: "var(--mf-border)" }}>
          <div className="border-b px-4 py-3.5" style={{ borderColor: "var(--mf-border)" }}><p className="text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>Quick Templates</p></div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 mf-thin-scroll">
            {TEMPLATES.map((t) => (
              <button key={t} className="mf-card-hover flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium" style={{ borderColor: "var(--mf-border)", color: "var(--mf-text)" }}>
                <MessageSquare size={14} style={{ color: "var(--mf-primary)" }} /> {t}
              </button>
            ))}
            <div className="relative mt-3 overflow-hidden rounded-xl border p-3" style={{ borderColor: "var(--mf-border)", background: "var(--mf-primary-soft)" }}>
              <div className="absolute inset-0 mf-mesh opacity-70" />
              <p className="relative flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--mf-primary)" }}><Sparkles size={14} /> AI Reply</p>
              <p className="relative mt-1 text-[12px]" style={{ color: "var(--mf-text-2)" }}>Draft a friendly confirmation message automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
