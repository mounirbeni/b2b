import type { Appointment, Clinic, Patient, ReminderLog, Subscription, User } from "@prisma/client";

export type { Appointment, Clinic, Patient, ReminderLog, Subscription, User };

export type Status =
  | "SCHEDULED"
  | "CONFIRMED"
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export type AppointmentWithPatient = Omit<Appointment, "status"> & {
  status: Status;
  patient: Patient;
  reminders?: ReminderLog[];
};

export type PatientWithStats = Patient & {
  totalVisits: number;
  lastVisit: Date | null;
};

export const APPOINTMENT_TYPES = ["CONSULTATION", "FOLLOW_UP", "URGENT"] as const;
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const APPOINTMENT_DURATIONS = [15, 30, 45, 60] as const;

export const STATUS_LABELS: Record<Status, string> = {
  SCHEDULED: "مجدول",
  CONFIRMED: "مؤكد",
  WAITING: "في الانتظار",
  IN_PROGRESS: "قيد الكشف",
  COMPLETED: "منتهي",
  NO_SHOW: "لم يحضر",
  CANCELLED: "ملغى",
};

export const STATUS_COLORS: Record<Status, string> = {
  SCHEDULED: "bg-gray-100 text-gray-700 border-gray-300",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-300",
  WAITING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-300",
  COMPLETED: "bg-green-100 text-green-700 border-green-300",
  NO_SHOW: "bg-red-100 text-red-700 border-red-300",
  CANCELLED: "bg-gray-100 text-gray-400 border-gray-300 line-through",
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  CONSULTATION: "استشارة",
  FOLLOW_UP: "مراجعة",
  URGENT: "حالة طارئة",
};

export interface ApiError {
  error: string;
}

export const SPECIALTIES = [
  "GENERAL",
  "DENTIST",
  "DERMATOLOGY",
  "PEDIATRICS",
  "CARDIOLOGY",
  "GYNECOLOGY",
  "OPHTHALMOLOGY",
  "ENT",
  "ORTHOPEDICS",
  "PSYCHIATRY",
  "NEUROLOGY",
  "UROLOGY",
  "ENDOCRINOLOGY",
  "GENERAL_SURGERY",
  "PHYSIOTHERAPY",
] as const;
export type Specialty = (typeof SPECIALTIES)[number];

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  GENERAL: "طب عام",
  DENTIST: "طب الأسنان",
  DERMATOLOGY: "الأمراض الجلدية",
  PEDIATRICS: "طب الأطفال",
  CARDIOLOGY: "أمراض القلب",
  GYNECOLOGY: "أمراض النساء والتوليد",
  OPHTHALMOLOGY: "طب العيون",
  ENT: "أنف وأذن وحنجرة",
  ORTHOPEDICS: "جراحة العظام",
  PSYCHIATRY: "الطب النفسي",
  NEUROLOGY: "طب الأعصاب",
  UROLOGY: "المسالك البولية",
  ENDOCRINOLOGY: "الغدد الصماء والسكري",
  GENERAL_SURGERY: "الجراحة العامة",
  PHYSIOTHERAPY: "العلاج الطبيعي",
};

export const MOROCCAN_CITIES = [
  "الدار البيضاء",
  "الرباط",
  "فاس",
  "مراكش",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "القنيطرة",
  "تطوان",
  "آسفي",
  "الجديدة",
  "بني ملال",
  "خريبكة",
  "سطات",
  "الناظور",
  "برشيد",
  "سلا",
  "خميسات",
  "العيون",
  "الصويرة",
  "شفشاون",
  "تازة",
  "تارودانت",
  "ورزازات",
] as const;
export type MoroccanCity = (typeof MOROCCAN_CITIES)[number];

export const CLINIC_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;
export type ClinicStatus = (typeof CLINIC_STATUSES)[number];

export const CLINIC_STATUS_LABELS: Record<ClinicStatus, string> = {
  PENDING: "قيد المراجعة",
  APPROVED: "موافَق عليها",
  REJECTED: "مرفوضة",
  SUSPENDED: "معلّقة",
};

export const CLINIC_STATUS_COLORS: Record<ClinicStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-700 border-green-300",
  REJECTED: "bg-red-100 text-red-700 border-red-300",
  SUSPENDED: "bg-gray-100 text-gray-500 border-gray-300",
};

export const SUBSCRIPTION_PLANS = ["TRIAL", "FREE", "BASIC", "PRO"] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const SUBSCRIPTION_PLAN_LABELS: Record<SubscriptionPlan, string> = {
  TRIAL: "تجريبي",
  FREE: "مجاني",
  BASIC: "أساسي",
  PRO: "مميز",
};

export const SUBSCRIPTION_STATUSES = ["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  TRIALING: "تجربة مجانية",
  ACTIVE: "نشط",
  PAST_DUE: "متأخر الدفع",
  CANCELED: "ملغى",
};
