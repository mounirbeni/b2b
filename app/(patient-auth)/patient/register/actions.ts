"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { patientAccountRegisterSchema } from "@/lib/validations";
import { normalizeMoroccanPhone } from "@/lib/phone";

export interface PatientRegisterResult {
  success: boolean;
  error?: string;
}

export async function patientRegisterAction(formData: FormData): Promise<PatientRegisterResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    city: String(formData.get("city") ?? ""),
  };

  const parsed = patientAccountRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const phone = normalizeMoroccanPhone(parsed.data.phone);
  const email = parsed.data.email ? parsed.data.email.toLowerCase().trim() : null;

  const existing = await prisma.patientAccount.findFirst({
    where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
  });
  if (existing) {
    return { success: false, error: "يوجد حساب مسجل بهذا الهاتف أو البريد الإلكتروني" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.patientAccount.create({
    data: {
      name: parsed.data.name,
      phone,
      email,
      password: hashedPassword,
      city: parsed.data.city || null,
    },
  });

  return { success: true };
}
