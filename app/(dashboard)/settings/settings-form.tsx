"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettingsAction } from "./actions";
import type { User } from "@/types";

export function SettingsForm({ user }: { user: User }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
          <Input id="clinicName" name="clinicName" defaultValue={user.clinicName ?? ""} required />
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
          <Input id="address" name="address" defaultValue={user.address ?? ""} />
        </div>
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
