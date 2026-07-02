import type { Appointment, Patient, ReminderLog, User } from "@prisma/client";

export type { Appointment, Patient, ReminderLog, User };

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
