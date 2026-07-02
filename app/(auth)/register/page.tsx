"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOROCCAN_CITIES, SPECIALTIES, SPECIALTY_LABELS } from "@/types";
import { registerAction } from "./actions";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!specialty || !city) {
      toast.error("التخصص والمدينة مطلوبان");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (!result.success) {
      toast.error(result.error ?? "حدث خطأ ما");
      setLoading(false);
      return;
    }

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      toast.success("تم إنشاء الحساب، يرجى تسجيل الدخول");
      router.push("/login");
      return;
    }

    toast.success("تم إنشاء الحساب بنجاح");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>سجّل عيادتك للبدء في استخدام النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">اسم العيادة</Label>
              <Input id="clinicName" name="clinicName" required placeholder="عيادة النور" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">التخصص</Label>
              <input type="hidden" name="specialty" value={specialty} />
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {SPECIALTY_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <input type="hidden" name="city" value={city} />
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {MOROCCAN_CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">اسمك الكامل</Label>
              <Input id="name" name="name" required placeholder="د. محمد العلوي" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" dir="ltr" required placeholder="doctor@clinic.ma" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">الهاتف (اختياري)</Label>
              <Input id="phone" name="phone" dir="ltr" placeholder="+212600000000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" name="password" type="password" dir="ltr" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            بإنشاء الحساب أنت توافق على{" "}
            <Link href="/terms" className="underline-offset-4 hover:underline">
              شروط الاستخدام
            </Link>{" "}
            و{" "}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              سياسة الخصوصية
            </Link>
          </p>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            لديك حساب؟{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
