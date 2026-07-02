"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingWidgetProps {
  clinicSlug: string;
  isPatient: boolean;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingWidget({ clinicSlug, isPatient }: BookingWidgetProps) {
  const router = useRouter();
  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingTime, setBookingTime] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/public/clinics/${clinicSlug}/availability?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clinicSlug, date]);

  async function handleBook(time: string) {
    if (!isPatient) {
      toast.info("سجّل دخولك كمريض أولاً لحجز موعد");
      router.push("/patient/login");
      return;
    }

    setBookingTime(time);
    try {
      const res = await fetch("/api/public/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicSlug, date, time }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل الحجز");

      toast.success("تم حجز موعدك بنجاح");
      setSlots((prev) => prev.filter((s) => s !== time));
      router.push("/patient/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الحجز");
      setSlots((prev) => prev.filter((s) => s !== time));
    } finally {
      setBookingTime(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">احجز موعداً</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="date"
          value={date}
          min={todayIso()}
          onChange={(e) => setDate(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />

        {loading ? (
          <p className="text-sm text-muted-foreground">جاري تحميل الأوقات المتاحة...</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد أوقات متاحة في هذا اليوم</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((time) => (
              <Button
                key={time}
                type="button"
                variant="outline"
                size="sm"
                dir="ltr"
                disabled={bookingTime === time}
                onClick={() => handleBook(time)}
              >
                <CalendarCheck className="h-3.5 w-3.5" /> {time}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
