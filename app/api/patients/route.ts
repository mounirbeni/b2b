import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = 20;

  const where = {
    userId: session.user.id,
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        appointments: {
          select: { dateTime: true },
          orderBy: { dateTime: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.patient.count({ where }),
  ]);

  const data = patients.map((p) => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    email: p.email,
    birthDate: p.birthDate,
    gender: p.gender,
    totalVisits: p.appointments.length,
    lastVisit: p.appointments[0]?.dateTime ?? null,
  }));

  return NextResponse.json({ data, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = patientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : null,
        gender: parsed.data.gender || null,
        address: parsed.data.address,
        notes: parsed.data.notes,
        userId: session.user.id,
      },
    });
    return NextResponse.json(patient, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء المريض" }, { status: 500 });
  }
}
