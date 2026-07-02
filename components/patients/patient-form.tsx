"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient } from "@/types";

interface PatientFormProps {
  patient?: Patient;
}

export function PatientForm({ patient }: PatientFormProps) {
  const router = useRouter();
  const isEdit = !!patient;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: patient?.name ?? "",
    phone: patient?.phone ?? "",
    email: patient?.email ?? "",
    birthDate: patient?.birthDate ? new Date(patient.birthDate).toISOString().slice(0, 10) : "",
    gender: patient?.gender ?? "",
    address: patient?.address ?? "",
    notes: patient?.notes ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.phone) {
      toast.error("اسم المريض والهاتف مطلوبان");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/patients/${patient!.id}` : "/api/patients", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل حفظ المريض");

      toast.success(isEdit ? "تم تحديث بيانات المريض" : "تم إضافة المريض بنجاح");
      router.push(isEdit ? `/patients/${patient!.id}` : `/patients/${data.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">الهاتف</Label>
          <Input
            id="phone"
            dir="ltr"
            required
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            placeholder="+212600000000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">تاريخ الميلاد</Label>
          <Input
            id="birthDate"
            type="date"
            value={form.birthDate}
            onChange={(e) => setForm((s) => ({ ...s, birthDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>الجنس</Label>
          <Select value={form.gender} onValueChange={(v) => setForm((s) => ({ ...s, gender: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الجنس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">ذكر</SelectItem>
              <SelectItem value="FEMALE">أنثى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "جاري الحفظ..." : isEdit ? "تحديث" : "إضافة المريض"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
