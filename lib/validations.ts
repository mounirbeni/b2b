import { z } from "zod";
import { MOROCCAN_CITIES, SPECIALTIES } from "@/types";

export const registerSchema = z.object({
  clinicName: z.string().min(2, "اسم العيادة مطلوب"),
  specialty: z.enum(SPECIALTIES, { errorMap: () => ({ message: "التخصص مطلوب" }) }),
  city: z.enum(MOROCCAN_CITIES, { errorMap: () => ({ message: "المدينة مطلوبة" }) }),
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().optional(),
});

export const clinicSettingsSchema = z.object({
  clinicName: z.string().min(2, "اسم العيادة مطلوب"),
  specialty: z.enum(SPECIALTIES, { errorMap: () => ({ message: "التخصص مطلوب" }) }),
  city: z.enum(MOROCCAN_CITIES, { errorMap: () => ({ message: "المدينة مطلوبة" }) }),
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().optional(),
  clinicPhone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
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

export const patientAccountRegisterSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(6, "رقم الهاتف مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal("")),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  city: z.enum(MOROCCAN_CITIES).optional().or(z.literal("")),
});

export const patientAccountLoginSchema = z.object({
  identifier: z.string().min(1, "الهاتف أو البريد الإلكتروني مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const bookingSchema = z.object({
  clinicSlug: z.string().min(1),
  date: z.string().min(1, "التاريخ مطلوب"),
  time: z.string().min(1, "الوقت مطلوب"),
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
