import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { combineDateAndTime } from "@/lib/date-utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { patient: true, reminders: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "الموعد غير موجود" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const existing = await prisma.appointment.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "الموعد غير موجود" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = appointmentSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }

  const dateTime =
    parsed.data.date && parsed.data.time
      ? combineDateAndTime(new Date(parsed.data.date), parsed.data.time)
      : undefined;

  const appointment = await prisma.appointment.update({
    where: { id: params.id },
    data: {
      ...(dateTime && { dateTime }),
      ...(parsed.data.duration !== undefined && { duration: parsed.data.duration }),
      ...(parsed.data.type !== undefined && { type: parsed.data.type }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes }),
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      ...(parsed.data.patientId !== undefined && { patientId: parsed.data.patientId }),
    },
    include: { patient: true },
  });

  return NextResponse.json(appointment);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const existing = await prisma.appointment.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "الموعد غير موجود" }, { status: 404 });
  }

  await prisma.appointment.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ success: true });
}
