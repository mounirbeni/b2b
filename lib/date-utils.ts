import { format, parse, addMinutes, isSameDay, startOfDay } from "date-fns";
import { ar, fr } from "date-fns/locale";

export const TIME_SLOT_START_HOUR = 8;
export const TIME_SLOT_END_HOUR = 20;
export const TIME_SLOT_INTERVAL_MINUTES = 30;

/** Display date as DD/MM/YYYY per project spec */
export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy");
}

/** 24-hour time display, e.g. 14:30 */
export function formatTimeDisplay(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "HH:mm");
}

/** Long date with Arabic weekday/month names, e.g. الأربعاء 02 يوليوز 2026 */
export function formatDateArabic(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "EEEE dd MMMM yyyy", { locale: ar });
}

export function formatDateFrench(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "EEEE dd MMMM yyyy", { locale: fr });
}

export function generateTimeSlots(
  startHour = TIME_SLOT_START_HOUR,
  endHour = TIME_SLOT_END_HOUR,
  intervalMinutes = TIME_SLOT_INTERVAL_MINUTES
): string[] {
  const slots: string[] = [];
  let current = new Date();
  current.setHours(startHour, 0, 0, 0);
  const end = new Date();
  end.setHours(endHour, 0, 0, 0);

  while (current < end) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, intervalMinutes);
  }
  return slots;
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return isSameDay(d, new Date());
}

export { startOfDay, parse };
