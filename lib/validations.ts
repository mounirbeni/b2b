import { z } from "zod";

export const registerSchema = z.object({
  clinicName: z.string().min(2, "اسم العيادة مطلوب"),
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const patientSchema = z.object({
  name: z.string().min(2, "اسم المريض مطلوب"),
  phone: z.string().min(6, "رقم الهاتف مطلوب"),
  email: z.string().email().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "المريض مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  time: z.string().min(1, "الوقت مطلوب"),
  duration: z.coerce.number().int().positive().default(30),
  type: z.enum(["CONSULTATION", "FOLLOW_UP", "URGENT"]).default("CONSULTATION"),
  notes: z.string().optional(),
  status: z
    .enum(["SCHEDULED", "CONFIRMED", "WAITING", "IN_PROGRESS", "COMPLETED", "NO_SHOW", "CANCELLED"])
    .optional(),
});
