import { NextRequest, NextResponse } from "next/server";
import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { combineDateAndTime } from "@/lib/date-utils";

export async function GET(req: NextRequest) {
  const session = await requireClinicSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let dateTimeFilter: { gte?: Date; lte?: Date } | undefined;

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    dateTimeFilter = { gte: start, lte: end };
  } else if (from && to) {
    dateTimeFilter = { gte: new Date(from), lte: new Date(to) };
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      clinicId: session.user.clinicId,
      ...(dateTimeFilter && { dateTime: dateTimeFilter }),
    },
    include: { patient: true, reminders: true },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const session = await requireClinicSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }

  const patient = await prisma.patient.findFirst({
    where: { id: parsed.data.patientId, clinicId: session.user.clinicId },
  });
  if (!patient) {
    return NextResponse.json({ error: "المريض غير موجود" }, { status: 404 });
  }

  const dateTime = combineDateAndTime(new Date(parsed.data.date), parsed.data.time);

  try {
    const appointment = await prisma.appointment.create({
      data: {
        dateTime,
        duration: parsed.data.duration,
        type: parsed.data.type,
        notes: parsed.data.notes,
        status: parsed.data.status ?? "SCHEDULED",
        patientId: parsed.data.patientId,
        clinicId: session.user.clinicId,
      },
      include: { patient: true },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الموعد" }, { status: 500 });
  }
}
