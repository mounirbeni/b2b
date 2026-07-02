import Link from "next/link";
import {
  Search, Stethoscope, CalendarCheck, BarChart3, MessageCircle, ShieldCheck,
  Sparkles, Users, ArrowLeft, Clock, CheckCircle2, LayoutDashboard, Bell,
  Star, ChevronDown, Activity, Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: CalendarCheck, title: "حجز فوري ومباشر", desc: "اختر الوقت المتاح واحجز في أقل من دقيقتين، دون مكالمات ولا انتظار.", color: "#2563eb" },
  { icon: MessageCircle, title: "تذكير تلقائي عبر واتساب", desc: "رسالة تذكير قبل الموعد تقلّل نسبة الغياب وتحافظ على انتظام الجدول.", color: "#10b981" },
  { icon: LayoutDashboard, title: "إدارة كاملة للعيادة", desc: "لوحة تحكم لحظية للمواعيد، الطابور، والاستشارات — كل شيء في مكان واحد.", color: "#7c6cf5" },
  { icon: Users, title: "سجل المرضى والمواعيد", desc: "ملف لكل مريض مع تاريخ الزيارات، منظّم ومتاح فورًا عند الحاجة.", color: "#f59e0b" },
  { icon: BarChart3, title: "تقارير وتحليلات", desc: "تابع الأداء اليومي: المواعيد، المرضى الجدد، ونِسب الحضور بلمحة.", color: "#0ea5e9" },
  { icon: ShieldCheck, title: "آمن وخاص", desc: "تشفير للبيانات وخصوصية تامّة — لا نشارك معلوماتك مع أي جهة.", color: "#ec4899" },
];

const VALUE_STRIP = [
  { icon: Zap, label: "حجز في أقل من دقيقتين" },
  { icon: Clock, label: "متاح 24/7" },
  { icon: ShieldCheck, label: "بيانات مشفّرة" },
  { icon: CheckCircle2, label: "بدون رسوم على المرضى" },
];

const CLINIC_BULLETS = [
  "لوحة تحكم لحظية للمواعيد والطابور",
  "استقبال حجوزات المرضى مباشرة من الدليل",
  "تذكيرات واتساب تلقائية تقلّل الغياب",
  "تقارير أداء يومية وتحليلات واضحة",
];

const STEPS = [
  { icon: Search, title: "ابحث", desc: "اختر التخصص والمدينة المناسبين لك" },
  { icon: CalendarCheck, title: "احجز", desc: "اختر الوقت المتاح وأكّد الحجز فورًا" },
  { icon: Bell, title: "تابع", desc: "يصلك تذكير، وتراجع حجوزاتك في أي وقت" },
];

const FAQ = [
  { q: "هل استخدام المنصة مجاني للمرضى؟", a: "نعم، البحث والحجز مجانيان تمامًا للمرضى — بلا أي رسوم." },
  { q: "كيف أحجز موعدًا؟", a: "ابحث عن عيادة حسب التخصص والمدينة، اختر وقتًا متاحًا، وأكّد الحجز — كل ذلك في أقل من دقيقتين." },
  { q: "أنا صاحب عيادة، كيف أبدأ؟", a: "سجّل عيادتك مجانًا. بعد الموافقة عليها تظهر في الدليل العام وتبدأ باستقبال حجوزات المرضى مباشرة، مع لوحة تحكم كاملة لإدارتها." },
  { q: "هل بياناتي آمنة؟", a: "نعم. نستخدم تشفيرًا للبيانات ولا نشاركها مع أي جهة. المنصة أداة حجز وإدارة، والمعلومات الطبية تبقى بين المريض والعيادة." },
  { q: "هل أحصل على تذكير بموعدي؟", a: "نعم، يصلك تذكير تلقائي عبر واتساب قبل موعدك للحفاظ على انتظامك." },
];

const PREVIEW_ROWS = [
  { name: "سارة أحمد", time: "09:00", status: "مؤكد", tone: "success" as const },
  { name: "عمر خالد", time: "09:30", status: "في الانتظار", tone: "warning" as const },
  { name: "نورة حسن", time: "10:00", status: "قيد الكشف", tone: "primary" as const },
  { name: "يوسف علي", time: "10:30", status: "مجدول", tone: "neutral" as const },
];

const TONE_BG: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  primary: "bg-blue-100 text-blue-700",
  neutral: "bg-slate-100 text-slate-600",
};

/* Small reusable dashboard mockup used in hero + clinics section */
function DashboardMock() {
  return (
    <div className="hero-panel relative rounded-2xl p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white"><Activity className="h-4 w-4" /></span>
          <span className="text-[13px] font-bold text-slate-800">لوحة العيادة</span>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">مباشر</span>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { n: "24", l: "مواعيد اليوم", c: "text-blue-600" },
          { n: "6", l: "في الانتظار", c: "text-amber-600" },
          { n: "18", l: "منتهية", c: "text-emerald-600" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-slate-100 bg-white p-2.5 text-center">
            <p className={cn("text-[19px] font-bold leading-none", s.c)}>{s.n}</p>
            <p className="mt-1 text-[10px] text-slate-400">{s.l}</p>
          </div>
        ))}
      </div>
      {/* tiny bar chart */}
      <div className="mb-3 flex h-16 items-end gap-1.5 rounded-xl border border-slate-100 bg-white px-3 pb-3 pt-2">
        {[40, 65, 52, 88, 74, 30, 16].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: i === 3 ? "#2563eb" : "#bfdbfe" }} />
        ))}
      </div>
      <div className="space-y-1.5">
        {PREVIEW_ROWS.slice(0, 3).map((r) => (
          <div key={r.name} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-600">{r.name[0]}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-slate-800">{r.name}</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400">{r.time}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", TONE_BG[r.tone])}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const approvedClinics = await prisma.clinic.count({ where: { status: "APPROVED" } });

  return (
    <div>
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #0a1020 0%, #0f1c3a 50%, #0a1020 100%)" }}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-glow absolute -top-32 right-[-8%] h-[30rem] w-[30rem] rounded-full opacity-40 blur-[100px]" style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }} />
          <div className="hero-glow absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", animationDelay: "-6s" }} />
          <div className="hero-grid absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hero-rise space-y-6 text-center lg:text-right">
              <span className="hero-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> منصة الحجز وإدارة العيادات
              </span>
              <h1 className="text-[34px] font-bold leading-[1.15] tracking-tight text-white sm:text-[52px]">
                احجز موعدك الطبي
                <br />
                <span className="bg-gradient-to-l from-amber-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">بثقة، وبلا انتظار</span>
              </h1>
              <p className="mx-auto max-w-lg text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0">
                منصة تجمع عيادات موثوقة من مختلف التخصصات في مدينتك، وتمنح العيادات نظامًا متكاملًا لإدارة المواعيد والمرضى.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="w-full bg-white text-slate-900 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)] hover:bg-white/90 sm:w-auto">
                  <Link href="/search"><Search className="h-4 w-4" /> ابحث عن عيادة</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="hero-glass w-full border-white/15 text-white hover:bg-white/10 hover:text-white sm:w-auto">
                  <Link href="/register"><Stethoscope className="h-4 w-4" /> سجّل عيادتك</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 text-[13px] text-white/55 lg:justify-start">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> مجاني للمرضى</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> بيانات مشفّرة</span>
                {approvedClinics >= 10 ? (
                  <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" /> {approvedClinics}+ عيادة معتمدة</span>
                ) : (
                  <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" /> عيادات موثّقة تنضمّ أسبوعيًا</span>
                )}
              </div>
            </div>

            {/* Floating product preview */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
              <div className="hero-float" style={{ ["--tilt" as string]: "-1.5deg" }}>
                <DashboardMock />
              </div>
              <div className="hero-panel hero-float absolute -bottom-6 left-2 z-10 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 sm:-left-6" style={{ ["--tilt" as string]: "3deg", animationDelay: "-3s" }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"><MessageCircle className="h-4 w-4" /></span>
                <div>
                  <p className="text-[10px] text-slate-400">تذكير واتساب</p>
                  <p className="text-[12px] font-bold text-slate-800">تم الإرسال ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Value strip ================= */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 md:justify-between md:px-6">
          {VALUE_STRIP.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-[14px] font-medium text-slate-600">
              <Icon className="h-[18px] w-[18px] text-primary" /> {label}
            </div>
          ))}
        </div>
      </section>

      {/* ================= Features ================= */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">لماذا MBN Health</p>
          <h2 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900 sm:text-[34px]">كل ما تحتاجه العيادة، وما يريحه المريض</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-500">تجربة واحدة متكاملة — من بحث المريض عن عيادة، حتى إدارة العيادة لمواعيدها ومرضاها.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(15,23,42,0.22)]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15" style={{ background: color }} />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl" style={{ color, background: `color-mix(in srgb, ${color} 12%, white)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 18%, transparent)` }}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 text-[16px] font-bold text-slate-900">{title}</h3>
              <p className="relative mt-1.5 text-[14px] leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= For clinics ================= */}
      <section id="clinics" className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-br from-blue-100/70 to-emerald-100/50 blur-2xl" />
            <div style={{ transform: "rotate(0.5deg)" }}>
              <DashboardMock />
            </div>
          </div>
          <div className="order-1 space-y-6 text-center lg:order-2 lg:text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700">
              <Stethoscope className="h-4 w-4" /> للعيادات
            </span>
            <h2 className="text-[28px] font-bold tracking-tight text-slate-900 sm:text-[34px]">أدر عيادتك من شاشة واحدة</h2>
            <p className="text-[15px] leading-relaxed text-slate-500">
              نظام إدارة كامل يأتيك مع كل تسجيل — استقبل الحجوزات، نظّم الطابور، وتابع أداء عيادتك دون أوراق ولا فوضى.
            </p>
            <ul className="space-y-3">
              {CLINIC_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14.5px] text-slate-700 lg:justify-end">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 lg:order-2"><CheckCircle2 className="h-4 w-4" /></span>
                  <span className="lg:order-1">{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/register">سجّل عيادتك مجانًا <ArrowLeft className="h-4 w-4 rtl-flip" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= How it works ================= */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:px-6 md:py-28">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">بثلاث خطوات</p>
          <h2 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900 sm:text-[34px]">كيف تعمل المنصة؟</h2>
        </div>
        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="absolute inset-x-16 top-8 hidden h-px bg-gradient-to-l from-transparent via-primary/25 to-transparent sm:block" aria-hidden />
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_12px_28px_-10px_rgba(37,99,235,0.45)] ring-1 ring-slate-100">
                <Icon className="h-6 w-6" />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white ring-2 ring-white">{i + 1}</span>
              </div>
              <h3 className="text-[17px] font-bold text-slate-900">{title}</h3>
              <p className="max-w-[16rem] text-[14px] text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="scroll-mt-20 border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-28">
          <div className="text-center">
            <h2 className="text-[28px] font-bold tracking-tight text-slate-900 sm:text-[34px]">الأسئلة الشائعة</h2>
            <p className="mt-3 text-[15px] text-slate-500">كل ما تريد معرفته قبل أن تبدأ</p>
          </div>
          <div className="mt-12 space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl border border-slate-100 bg-white px-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors open:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-[14px] leading-relaxed text-slate-500">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Final CTA ================= */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-20 md:px-6 md:pt-24">
        <div className="relative overflow-hidden rounded-[32px] px-6 py-16 text-center md:py-20" style={{ background: "linear-gradient(150deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)" }}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="hero-grid absolute inset-0 opacity-60" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-[28px] font-bold leading-tight text-white sm:text-[38px]">ابدأ اليوم — لموعدك القادم أو لعيادتك</h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
              مريض يبحث عن موعد؟ أو عيادة تريد نظامًا يريحها؟ كلاهما يبدأ من هنا.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full bg-white text-blue-700 hover:bg-white/90 sm:w-auto">
                <Link href="/search"><Search className="h-4 w-4" /> ابحث عن عيادة</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto">
                <Link href="/register"><Stethoscope className="h-4 w-4" /> سجّل عيادتك</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
