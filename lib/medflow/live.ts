import { prisma } from "@/lib/prisma";
import type { Status } from "@/types";

/** Real, clinic-scoped data fetchers for MedFlow — every query is filtered by clinicId,
 * mirroring the same access pattern as the REST API routes under app/api. No mock data. */

const ALL_STATUSES: Status[] = [
  "SCHEDULED",
  "CONFIRMED",
  "WAITING",
  "IN_PROGRESS",
  "COMPLETED",
  "NO_SHOW",
  "CANCELLED",
];

function dayRange(base = new Date()) {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function startOfWeekMonday(base = new Date()) {
  const d = new Date(base);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getClinic(clinicId: string) {
  return prisma.clinic.findUnique({
    where: { id: clinicId },
    select: { id: true, name: true, status: true, specialty: true, city: true },
  });
}

export async function getDashboardData(clinicId: string) {
  const { start: todayStart, end: todayEnd } = dayRange();
  const weekAgo = new Date(todayStart);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const sixWeeksAgo = startOfWeekMonday();
  sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 35);
  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

  const [
    todayAppointments,
    totalPatients,
    newPatientsThisMonth,
    weekAppointments,
    sixWeekPatients,
    monthStatusCounts,
    recentPatients,
    recentAppointments,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: { clinicId, dateTime: { gte: todayStart, lte: todayEnd } },
      include: { patient: true },
      orderBy: { dateTime: "asc" },
    }),
    prisma.patient.count({ where: { clinicId } }),
    prisma.patient.count({ where: { clinicId, createdAt: { gte: monthStart } } }),
    prisma.appointment.findMany({
      where: { clinicId, dateTime: { gte: weekAgo, lte: todayEnd } },
      select: { dateTime: true, status: true },
    }),
    prisma.patient.findMany({
      where: { clinicId, createdAt: { gte: sixWeeksAgo } },
      select: { createdAt: true },
    }),
    prisma.appointment.groupBy({
      by: ["status"],
      where: { clinicId, dateTime: { gte: monthStart } },
      _count: { _all: true },
    }),
    prisma.patient.findMany({
      where: { clinicId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { clinicId },
      include: { patient: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  const countByStatus = (list: { status: string }[]) =>
    Object.fromEntries(ALL_STATUSES.map((s) => [s, list.filter((a) => a.status === s).length])) as Record<
      Status,
      number
    >;

  const today = countByStatus(todayAppointments);

  // Last 7 days appointment trend (Mon-first labels not needed, just chronological day counts)
  const trend: { label: string; v: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(todayStart);
    day.setDate(day.getDate() - i);
    const { start, end } = dayRange(day);
    const count = weekAppointments.filter((a) => a.dateTime >= start && a.dateTime <= end).length;
    trend.push({ label: day.toLocaleDateString("ar", { weekday: "short" }), v: count });
  }

  // Last 6 weeks patient growth
  const growth: { label: string; v: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = startOfWeekMonday();
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const count = sixWeekPatients.filter((p) => p.createdAt >= weekStart && p.createdAt < weekEnd).length;
    growth.push({ label: `W${6 - i}`, v: count });
  }

  const monthCounts = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, monthStatusCounts.find((m) => m.status === s)?._count._all ?? 0])
  ) as Record<Status, number>;

  return {
    todayAppointments,
    counts: {
      todayTotal: todayAppointments.length,
      waiting: today.WAITING + today.CONFIRMED,
      inConsultation: today.IN_PROGRESS,
      completed: today.COMPLETED,
      cancelled: today.CANCELLED,
      noShow: today.NO_SHOW,
      totalPatients,
      newPatientsThisMonth,
    },
    trend,
    growth,
    monthByStatus: monthCounts,
    recentPatients,
    recentAppointments,
  };
}

export async function getWeekAppointments(clinicId: string, weekStart: Date) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return prisma.appointment.findMany({
    where: { clinicId, dateTime: { gte: start, lt: end } },
    include: { patient: true },
    orderBy: { dateTime: "asc" },
  });
}

export async function getPatientsPage(clinicId: string, search: string, page: number) {
  const pageSize = 20;
  const where = {
    clinicId,
    ...(search
      ? { OR: [{ name: { contains: search } }, { phone: { contains: search } }] }
      : {}),
  };

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: {
        appointments: {
          select: { dateTime: true, status: true },
          orderBy: { dateTime: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.patient.count({ where }),
  ]);

  return { patients, total, page, pageSize };
}

export async function getPatientDetail(clinicId: string, id: string) {
  return prisma.patient.findFirst({
    where: { id, clinicId },
    include: { appointments: { orderBy: { dateTime: "desc" } } },
  });
}

export async function getReceptionQueue(clinicId: string) {
  const { start, end } = dayRange();
  return prisma.appointment.findMany({
    where: { clinicId, dateTime: { gte: start, lte: end }, status: { in: ["WAITING", "CONFIRMED", "IN_PROGRESS", "SCHEDULED"] } },
    include: { patient: true },
    orderBy: { dateTime: "asc" },
  });
}

export async function getReportsData(clinicId: string, range: { start: Date; end: Date }) {
  const [statusCounts, newPatients, total] = await Promise.all([
    prisma.appointment.groupBy({
      by: ["status"],
      where: { clinicId, dateTime: { gte: range.start, lte: range.end } },
      _count: { _all: true },
    }),
    prisma.patient.count({ where: { clinicId, createdAt: { gte: range.start, lte: range.end } } }),
    prisma.appointment.count({ where: { clinicId, dateTime: { gte: range.start, lte: range.end } } }),
  ]);

  const countByStatus = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, statusCounts.find((c) => c.status === s)?._count._all ?? 0])
  ) as Record<Status, number>;

  const completed = countByStatus.COMPLETED;
  const noShow = countByStatus.NO_SHOW;
  const cancelled = countByStatus.CANCELLED;
  const attended = total - cancelled;
  const noShowRate = attended > 0 ? Math.round((noShow / attended) * 100) : 0;

  return { countByStatus, newPatients, total, completed, noShowRate };
}

export function calcAge(birthDate: Date | null): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - birthDate.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const PALETTE = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#0ea5e9", "#14b8a6", "#f43f5e"];
export function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
