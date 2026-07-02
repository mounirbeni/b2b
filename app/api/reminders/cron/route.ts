import { NextRequest, NextResponse } from "next/server";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, whatsappTemplates } from "@/lib/whatsapp";

/** Meant to be triggered by an external scheduler daily at 08:00. Sends reminders for tomorrow's SCHEDULED appointments. */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const tomorrow = addDays(new Date(), 1);
  const rangeStart = startOfDay(tomorrow);
  const rangeEnd = endOfDay(tomorrow);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: "SCHEDULED",
      dateTime: { gte: rangeStart, lte: rangeEnd },
    },
    include: { patient: true, user: true, reminders: true },
  });

  const results: { appointmentId: string; status: string }[] = [];

  for (const appointment of appointments) {
    const alreadySent = appointment.reminders.some((r) => r.type === "WHATSAPP" && r.status === "SENT");
    if (alreadySent) {
      results.push({ appointmentId: appointment.id, status: "SKIPPED" });
      continue;
    }

    const message = whatsappTemplates.reminder({
      name: appointment.patient.name,
      date: appointment.dateTime,
      time: appointment.dateTime,
      clinicName: appointment.user.clinicName ?? "العيادة",
    });

    const result = await sendWhatsAppMessage(appointment.patient.phone, message);

    await prisma.reminderLog.create({
      data: {
        type: "WHATSAPP",
        status: result.success ? "SENT" : "FAILED",
        message,
        appointmentId: appointment.id,
      },
    });

    results.push({ appointmentId: appointment.id, status: result.success ? "SENT" : "FAILED" });
  }

  return NextResponse.json({ processed: results.length, results });
}
