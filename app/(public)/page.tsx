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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function HomePage() {
  return (
    <div className="space-y-16 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-blue-800 px-6 py-16 text-center text-white shadow-lg sm:py-24">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> منصة حجز طبي إلكتروني
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            ابحث واحجز موعدك الطبي في دقائق
          </h1>
          <p className="mx-auto max-w-lg text-base text-white/90 sm:text-lg">
            منصة تجمع عيادات من مختلف التخصصات في مدينتك، مع حجز إلكتروني فوري ومباشر
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-white text-primary shadow-md hover:bg-white/90 sm:w-auto">
              <Link href="/search">
                <Search className="h-4 w-4" /> ابحث عن عيادة
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
            >
              <Link href="/register">
                <Stethoscope className="h-4 w-4" /> سجّل عيادتك
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-center shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="group overflow-hidden border-2 transition-colors hover:border-primary">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">أنا مريض</h2>
            <p className="text-sm text-muted-foreground">
              ابحث عن عيادة حسب التخصص والمدينة، واحجز موعدك مباشرة عبر المنصة دون انتظار
            </p>
            <Button asChild className="w-full">
              <Link href="/search">ابحث عن عيادة</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-2 transition-colors hover:border-primary">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">أنا صاحب عيادة</h2>
            <p className="text-sm text-muted-foreground">
              سجّل عيادتك، أدر مواعيدك ومرضاك، واستقبل حجوزات جديدة مباشرة من المرضى
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">سجّل عيادتك الآن</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <h2 className="text-center text-2xl font-bold">كيف تعمل المنصة؟</h2>
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="absolute inset-x-0 top-6 hidden h-px bg-border sm:block" aria-hidden />
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative flex flex-col items-center gap-3 text-center">
              <div
                className={cn(
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">
                {i + 1}. {title}
              </h3>
              <p className="max-w-[16rem] text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
