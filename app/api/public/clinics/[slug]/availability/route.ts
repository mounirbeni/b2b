import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/date-utils";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "التاريخ مطلوب" }, { status: 400 });
  }

  const clinic = await prisma.clinic.findUnique({ where: { slug: params.slug } });
  if (!clinic || !clinic.specialty || !clinic.city) {
    return NextResponse.json({ error: "العيادة غير موجودة" }, { status: 404 });
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const now = new Date();
  if (dayEnd < now) {
    return NextResponse.json({ slots: [] });
  }

  const booked = await prisma.appointment.findMany({
    where: {
      clinicId: clinic.id,
      dateTime: { gte: dayStart, lte: dayEnd },
      status: { not: "CANCELLED" },
    },
    select: { dateTime: true },
  });

  const bookedTimes = new Set(
    booked.map((b) => b.dateTime.toTimeString().slice(0, 5))
  );

  const isToday = dayStart.toDateString() === now.toDateString();

  const slots = generateTimeSlots().filter((time) => {
    if (bookedTimes.has(time)) return false;
    if (isToday) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(dayStart);
      slotTime.setHours(hours, minutes, 0, 0);
      if (slotTime <= now) return false;
    }
    return true;
  });

  return NextResponse.json({ slots });
}
