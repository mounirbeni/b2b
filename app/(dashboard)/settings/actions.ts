"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface UpdateSettingsResult {
  success: boolean;
  error?: string;
}

export async function updateSettingsAction(formData: FormData): Promise<UpdateSettingsResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" };
  }

  const clinicName = String(formData.get("clinicName") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!clinicName || !name) {
    return { success: false, error: "اسم العيادة والاسم مطلوبان" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { clinicName, name, phone: phone || null, address: address || null },
  });

  revalidatePath("/settings");
  return { success: true };
}
