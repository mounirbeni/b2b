"use server";

import { revalidatePath } from "next/cache";
import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { clinicSettingsSchema } from "@/lib/validations";

export interface UpdateSettingsResult {
  success: boolean;
  error?: string;
}

export async function updateSettingsAction(formData: FormData): Promise<UpdateSettingsResult> {
  const session = await requireClinicSession();
  if (!session) {
    return { success: false, error: "غير مصرح" };
  }

  const raw = {
    clinicName: String(formData.get("clinicName") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
    city: String(formData.get("city") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    clinicPhone: String(formData.get("clinicPhone") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const parsed = clinicSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      clinic: {
        update: {
          name: parsed.data.clinicName,
          specialty: parsed.data.specialty,
          city: parsed.data.city,
          phone: parsed.data.clinicPhone || null,
          address: parsed.data.address || null,
          description: parsed.data.description || null,
        },
      },
    },
  });

  revalidatePath("/settings");
  return { success: true };
}
