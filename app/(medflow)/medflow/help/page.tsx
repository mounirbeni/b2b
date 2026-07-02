import {
  LifeBuoy, Search, BookOpen, MessageCircle, Video, Rocket, Sparkles, ChevronRight, Mail, Phone,
} from "lucide-react";
import { PageHeader, SectionCard, Pill } from "@/components/medflow/ui";

const CATEGORIES = [
  { label: "Getting Started", desc: "Set up your clinic in minutes", icon: <Rocket size={18} />, tone: "var(--mf-primary)", count: 12 },
  { label: "Appointments", desc: "Scheduling, drag & drop, reminders", icon: <BookOpen size={18} />, tone: "var(--mf-secondary)", count: 18 },
  { label: "Billing & Payments", desc: "Invoices, insurance, refunds", icon: <MessageCircle size={18} />, tone: "var(--mf-info)", count: 9 },
  { label: "Video Tutorials", desc: "Watch and learn the workflows", icon: <Video size={18} />, tone: "var(--mf-c4)", count: 24 },
];

const ARTICLES = [
  "How to register a walk-in patient in under 10 seconds",
  "Setting up automated appointment reminders (SMS & WhatsApp)",
  "Using the AI Medical Note Assistant during consultations",
  "Configuring insurance claims and reconciliation",
  "Managing staff roles, permissions and attendance",
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" subtitle="Guides, tutorials and 24/7 support" icon={<LifeBuoy size={20} />} />

      {/* Hero search */}
      <div className="relative overflow-hidden rounded-3xl border p-8 text-center" style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)" }}>
        <div className="absolute inset-0 mf-mesh" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-[24px] font-bold tracking-tight" style={{ color: "var(--mf-text)" }}>How can we help?</h2>
          <p className="mt-1 text-[14px]" style={{ color: "var(--mf-text-2)" }}>Search our knowledge base or ask the AI assistant.</p>
          <div className="relative mt-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
            <input className="mf-input h-12 pl-11 text-[15px]" placeholder="Search for guides, features, FAQs…" />
            <button className="mf-btn mf-btn-primary mf-btn-sm absolute right-1.5 top-1/2 -translate-y-1/2"><Sparkles size={14} /> Ask AI</button>
          </div>
        </div>
      </div>

      <div className="mf-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <button key={c.label} className="mf-card mf-card-hover p-5 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ color: c.tone, background: `color-mix(in srgb, ${c.tone} 14%, transparent)` }}>{c.icon}</span>
            <p className="mt-3 text-[15px] font-semibold" style={{ color: "var(--mf-text)" }}>{c.label}</p>
            <p className="text-[12.5px]" style={{ color: "var(--mf-text-2)" }}>{c.desc}</p>
            <p className="mt-2 text-[12px] font-medium" style={{ color: "var(--mf-primary)" }}>{c.count} articles →</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Popular Articles" bodyClassName="px-0 pb-0">
          {ARTICLES.map((a, i) => (
            <button key={a} className="flex w-full items-center gap-3 border-t px-5 py-3.5 text-left transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-bold mf-nums" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}>{i + 1}</span>
              <span className="flex-1 text-[13.5px] font-medium" style={{ color: "var(--mf-text)" }}>{a}</span>
              <ChevronRight size={16} style={{ color: "var(--mf-text-3)" }} />
            </button>
          ))}
        </SectionCard>

        <SectionCard title="Contact Support">
          <p className="text-[13px]" style={{ color: "var(--mf-text-2)" }}>Our team is available around the clock for enterprise clinics.</p>
          <div className="mt-4 space-y-2.5">
            <button className="mf-btn mf-btn-primary w-full"><MessageCircle size={16} /> Live Chat</button>
            <button className="mf-btn mf-btn-outline w-full"><Mail size={16} /> support@medflow.ai</button>
            <button className="mf-btn mf-btn-outline w-full"><Phone size={16} /> +1 800 MED-FLOW</button>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--mf-border)" }}>
            <span className="mf-dot mf-live" style={{ background: "var(--mf-success)" }} />
            <span className="text-[12.5px]" style={{ color: "var(--mf-text-2)" }}>All systems operational</span>
            <Pill tone="success">99.99%</Pill>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
