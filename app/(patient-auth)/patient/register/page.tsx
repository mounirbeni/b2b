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
import { patientRegisterAction } from "./actions";

export default function PatientRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await patientRegisterAction(formData);

    if (!result.success) {
      toast.error(result.error ?? "حدث خطأ ما");
      setLoading(false);
      return;
    }

    const phone = String(formData.get("phone"));
    const password = String(formData.get("password"));

    const signInResult = await signIn("patient-credentials", {
      identifier: phone,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      toast.success("تم إنشاء الحساب، يرجى تسجيل الدخول");
      router.push("/patient/login");
      return;
    }

    toast.success("تم إنشاء الحساب بنجاح");
    router.push("/patient/appointments");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">إنشاء حساب مريض</CardTitle>
          <CardDescription>سجّل لحجز مواعيد لدى العيادات ومتابعتها</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" name="name" required placeholder="محمد العلوي" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">الهاتف</Label>
              <Input id="phone" name="phone" dir="ltr" required placeholder="+212600000000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
              <Input id="email" name="email" type="email" dir="ltr" placeholder="you@example.com" />
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
            <Link href="/patient/login" className="text-primary underline-offset-4 hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
