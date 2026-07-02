import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/lib/validations";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const patient = await prisma.patient.findFirst({
    where: { id: params.id, clinicId: session.user.clinicId },
    include: {
      appointments: {
        orderBy: { dateTime: "desc" },
        include: { reminders: true },
      },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "المريض غير موجود" }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = patientSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }

  const existing = await prisma.patient.findFirst({ where: { id: params.id, clinicId: session.user.clinicId } });
  if (!existing) {
    return NextResponse.json({ error: "المريض غير موجود" }, { status: 404 });
  }

  const patient = await prisma.patient.update({
    where: { id: params.id },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.phone && { phone: parsed.data.phone }),
      ...(parsed.data.email !== undefined && { email: parsed.data.email || null }),
      ...(parsed.data.birthDate !== undefined && {
        birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : null,
      }),
      ...(parsed.data.gender !== undefined && { gender: parsed.data.gender || null }),
      ...(parsed.data.address !== undefined && { address: parsed.data.address }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes }),
    },
  });

  return NextResponse.json(patient);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const existing = await prisma.patient.findFirst({ where: { id: params.id, clinicId: session.user.clinicId } });
  if (!existing) {
    return NextResponse.json({ error: "المريض غير موجود" }, { status: 404 });
  }

  await prisma.patient.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
