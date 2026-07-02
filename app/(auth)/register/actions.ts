"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/slug";

export interface RegisterResult {
  success: boolean;
  error?: string;
}

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const raw = {
    clinicName: String(formData.get("clinicName") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
    city: String(formData.get("city") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "هذا البريد الإلكتروني مستخدم من قبل" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      password: hashedPassword,
      clinic: {
        create: {
          name: parsed.data.clinicName,
          specialty: parsed.data.specialty,
          city: parsed.data.city,
          slug: generateSlug(),
          subscription: {
            create: { plan: "TRIAL", status: "TRIALING", trialEndsAt },
          },
        },
      },
    },
  });

  return { success: true };
}
