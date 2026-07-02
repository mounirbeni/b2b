import Link from "next/link";
import {
  Search,
  Stethoscope,
  CalendarCheck,
  BarChart3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: CalendarCheck, label: "حجز فوري ومباشر" },
  { icon: MessageCircle, label: "تذكير تلقائي عبر واتساب" },
  { icon: Sparkles, label: "لكل التخصصات الطبية" },
  { icon: ShieldCheck, label: "بدون رسوم على المرضى" },
];

const STEPS = [
  { icon: Search, title: "ابحث", desc: "اختر التخصص والمدينة المناسبين لك" },
  { icon: CalendarCheck, title: "احجز", desc: "اختر الوقت المناسب واحجز فوراً" },
  { icon: BarChart3, title: "تابع", desc: "راجع حجوزاتك في أي وقت من حسابك" },
];

const PREVIEW_ROWS = [
  { name: "سارة أحمد", time: "09:00", status: "مؤكد", tone: "success" as const },
  { name: "عمر خالد", time: "09:30", status: "في الانتظار", tone: "warning" as const },
  { name: "نورة حسن", time: "10:00", status: "قيد الكشف", tone: "primary" as const },
];

const TONE_BG: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  primary: "bg-blue-100 text-blue-700",
};

export default async function HomePage() {
  const approvedClinics = await prisma.clinic.count({ where: { status: "APPROVED" } });

  return (
    <div className="space-y-20 pb-8">
      {/* ---------------- Hero ---------------- */}
      <section className="relative -mx-4 rounded-[28px] px-6 py-16 sm:-mx-0 sm:py-24" style={{ background: "linear-gradient(160deg, #0b1224 0%, #0f1a34 45%, #0b1224 100%)" }}>
        {/* Atmosphere: warm glow arc + cool blob + grid texture — clipped to its own rounded layer
            so the floating preview cards below can spill past the hero edge without being cut off. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
          <div className="hero-glow absolute -top-24 right-[-10%] h-[26rem] w-[26rem] rounded-full opacity-40 blur-[90px]" style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }} />
          <div className="hero-glow absolute -bottom-32 -left-16 h-[24rem] w-[24rem] rounded-full opacity-30 blur-[100px]" style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", animationDelay: "-6s" }} />
          <div className="hero-grid absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Copy */}
            <div className="hero-rise space-y-6 text-center lg:text-right">
              <span className="hero-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> منصة حجز طبي إلكتروني
              </span>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
                رعايتك الطبية تبدأ من{" "}
                <span className="bg-gradient-to-l from-amber-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  ثقة، لا انتظار
                </span>
              </h1>
              <p className="mx-auto max-w-lg text-base text-white/70 sm:text-lg lg:mx-0">
                منصة تجمع عيادات موثوقة من مختلف التخصصات في مدينتك، مع حجز إلكتروني فوري وتذكير تلقائي بموعدك
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="w-full bg-white text-slate-900 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.4)] hover:bg-white/90 sm:w-auto">
                  <Link href="/search">
                    <Search className="h-4 w-4" /> ابحث عن عيادة
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="hero-glass w-full border-white/15 text-white hover:bg-white/10 hover:text-white sm:w-auto">
                  <Link href="/register">
                    <Stethoscope className="h-4 w-4" /> سجّل عيادتك
                  </Link>
                </Button>
              </div>

              {/* Honest trust line — no inflated numbers */}
              <div className="flex items-center justify-center gap-2 pt-2 text-sm text-white/60 lg:justify-start">
                <Lock className="h-3.5 w-3.5" />
                {approvedClinics >= 10 ? (
                  <span>يثق بنا أكثر من {approvedClinics} عيادة معتمدة</span>
                ) : (
                  <span>عيادات موثّقة تنضمّ إلينا أسبوعيًا — كن من أوائلها</span>
                )}
              </div>
            </div>

            {/* Floating product preview */}
            <div className="relative mx-auto hidden w-full max-w-sm lg:block">
              <div
                className="hero-panel hero-float relative z-10 rounded-2xl p-4"
                style={{ ["--tilt" as string]: "-2deg" }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">مواعيد اليوم</p>
                    <p className="text-2xl font-bold text-slate-900">24</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">+12%</span>
                </div>
                <div className="space-y-2">
                  {PREVIEW_ROWS.map((r) => (
                    <div key={r.name} className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-600">
                        {r.name[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-800">{r.name}</p>
                        <p className="text-[11px] text-slate-400">{r.time}</p>
                      </div>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", TONE_BG[r.tone])}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="hero-panel hero-float absolute -bottom-6 -right-8 z-0 flex items-center gap-2.5 rounded-2xl px-4 py-3"
                style={{ ["--tilt" as string]: "3deg", animationDelay: "-3s" }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] text-slate-400">متوسط وقت الحجز</p>
                  <p className="text-sm font-bold text-slate-800">أقل من دقيقتين</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Feature chips ---------------- */}
      <section className="flex flex-wrap items-center justify-center gap-3">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-full border border-slate-100 bg-white px-4 py-2.5 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.15)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgba(15,23,42,0.2)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-slate-700">{label}</p>
          </div>
        ))}
      </section>

      {/* ---------------- Dual path ---------------- */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-[0_2px_20px_-8px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(37,99,235,0.25)]">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl transition-transform group-hover:scale-125" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-primary shadow-inner transition-transform group-hover:scale-110" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(59,130,246,0.06))" }}>
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">أنا مريض</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ابحث عن عيادة حسب التخصص والمدينة، واحجز موعدك مباشرة عبر المنصة دون انتظار
            </p>
            <Button asChild className="w-full">
              <Link href="/search">
                ابحث عن عيادة <ArrowLeft className="h-4 w-4 rtl-flip" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-[0_2px_20px_-8px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(16,185,129,0.25)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/60 blur-2xl transition-transform group-hover:scale-125" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-emerald-600 shadow-inner transition-transform group-hover:scale-110" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(52,211,153,0.06))" }}>
              <Stethoscope className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">أنا صاحب عيادة</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              سجّل عيادتك، أدر مواعيدك ومرضاك، واستقبل حجوزات جديدة مباشرة من المرضى
            </p>
            <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700">
              <Link href="/register">
                سجّل عيادتك الآن <ArrowLeft className="h-4 w-4 rtl-flip" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">كيف تعمل المنصة؟</h2>
          <p className="mt-1 text-sm text-muted-foreground">ثلاث خطوات بسيطة تفصلك عن موعدك القادم</p>
        </div>
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="absolute inset-x-12 top-7 hidden h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent sm:block" aria-hidden />
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_-8px_rgba(37,99,235,0.6)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="flex items-center gap-1.5 font-semibold text-slate-900">
                <CheckCircle2 className="h-4 w-4 text-primary/50" /> {title}
              </h3>
              <p className="max-w-[16rem] text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
