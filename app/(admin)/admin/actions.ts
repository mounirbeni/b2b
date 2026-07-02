"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { CLINIC_STATUSES, SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUSES } from "@/types";

export interface AdminActionResult {
  success: boolean;
  error?: string;
}

export async function updateClinicStatusAction(clinicId: string, status: string): Promise<AdminActionResult> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, error: "غير مصرح" };
  }

  if (!CLINIC_STATUSES.includes(status as (typeof CLINIC_STATUSES)[number])) {
    return { success: false, error: "حالة غير صالحة" };
  }

  await prisma.clinic.update({ where: { id: clinicId }, data: { status } });
  revalidatePath("/admin");
  return { success: true };
}

export async function updateSubscriptionAction(
  clinicId: string,
  plan: string,
  status: string
): Promise<AdminActionResult> {
  const session = await requireAdminSession();
  if (!session) {
    return { success: false, error: "غير مصرح" };
  }

  if (
    !SUBSCRIPTION_PLANS.includes(plan as (typeof SUBSCRIPTION_PLANS)[number]) ||
    !SUBSCRIPTION_STATUSES.includes(status as (typeof SUBSCRIPTION_STATUSES)[number])
  ) {
    return { success: false, error: "بيانات غير صالحة" };
  }

  await prisma.subscription.upsert({
    where: { clinicId },
    update: { plan, status },
    create: { clinicId, plan, status },
  });
  revalidatePath("/admin");
  return { success: true };
}
