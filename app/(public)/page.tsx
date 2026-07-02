import Link from "next/link";
import { Search, Stethoscope, CalendarCheck, BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4 py-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">ابحث واحجز موعدك الطبي في دقائق</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          منصة تجمع عيادات من مختلف التخصصات في مدينتك، مع حجز إلكتروني فوري ومباشر
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <Search className="h-8 w-8 text-primary" />
          <h2 className="text-lg font-semibold">أنا مريض</h2>
          <p className="text-sm text-muted-foreground">
            ابحث عن عيادة حسب التخصص والمدينة، واحجز موعدك مباشرة عبر المنصة
          </p>
          <Button asChild className="w-full">
            <Link href="/search">ابحث عن عيادة</Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h2 className="text-lg font-semibold">أنا صاحب عيادة</h2>
          <p className="text-sm text-muted-foreground">
            سجّل عيادتك، أدر مواعيدك ومرضاك، واستقبل حجوزات جديدة مباشرة من المرضى
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">سجّل عيادتك الآن</Link>
          </Button>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
        <div className="space-y-2">
          <Search className="mx-auto h-6 w-6 text-primary" />
          <h3 className="font-medium">١. ابحث</h3>
          <p className="text-sm text-muted-foreground">اختر التخصص والمدينة المناسبين لك</p>
        </div>
        <div className="space-y-2">
          <CalendarCheck className="mx-auto h-6 w-6 text-primary" />
          <h3 className="font-medium">٢. احجز</h3>
          <p className="text-sm text-muted-foreground">اختر الوقت المناسب واحجز فوراً</p>
        </div>
        <div className="space-y-2">
          <BarChart3 className="mx-auto h-6 w-6 text-primary" />
          <h3 className="font-medium">٣. تابع</h3>
          <p className="text-sm text-muted-foreground">راجع حجوزاتك في أي وقت من حسابك</p>
        </div>
      </section>
    </div>
  );
}
