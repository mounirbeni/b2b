"use client";

import { useState } from "react";
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
import { updateSettingsAction } from "./actions";
import type { Clinic, User } from "@/types";
import { MOROCCAN_CITIES, SPECIALTIES, SPECIALTY_LABELS } from "@/types";

export function SettingsForm({ user, clinic }: { user: User; clinic: Clinic }) {
  const [saving, setSaving] = useState(false);
  const [specialty, setSpecialty] = useState(clinic.specialty ?? "");
  const [city, setCity] = useState(clinic.city ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!specialty || !city) {
      toast.error("التخصص والمدينة مطلوبان");
      return;
    }

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateSettingsAction(formData);
    setSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "فشل حفظ الإعدادات");
      return;
    }
    toast.success("تم حفظ الإعدادات بنجاح");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clinicName">اسم العيادة</Label>
          <Input id="clinicName" name="clinicName" defaultValue={clinic.name} required />
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
          <Input id="name" name="name" defaultValue={user.name ?? ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">الهاتف</Label>
          <Input id="phone" name="phone" dir="ltr" defaultValue={user.phone ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" dir="ltr" defaultValue={user.email ?? ""} disabled />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">عنوان العيادة</Label>
          <Input id="address" name="address" defaultValue={clinic.address ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">نبذة عن العيادة (تظهر للمرضى)</Label>
          <Textarea id="description" name="description" defaultValue={clinic.description ?? ""} />
        </div>
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
