import { NextRequest, NextResponse } from "next/server";
import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, whatsappTemplates } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const session = await requireClinicSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const { appointmentId } = body as { appointmentId?: string };

  if (!appointmentId) {
    return NextResponse.json({ error: "appointmentId مطلوب" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, clinicId: session.user.clinicId },
    include: { patient: true, clinic: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "الموعد غير موجود" }, { status: 404 });
  }

  const message = whatsappTemplates.reminder({
    name: appointment.patient.name,
    date: appointment.dateTime,
    time: appointment.dateTime,
    clinicName: appointment.clinic.name,
  });

  const statusCallbackUrl = `${req.nextUrl.origin}/api/whatsapp/status`;
  const result = await sendWhatsAppMessage(appointment.patient.phone, message, statusCallbackUrl);

  const log = await prisma.reminderLog.create({
    data: {
      type: "WHATSAPP",
      status: result.success ? "SENT" : "FAILED",
      message,
      sid: result.sid,
      errorMessage: result.error,
      appointmentId: appointment.id,
    },
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error, log }, { status: 502 });
  }

  return NextResponse.json({ success: true, log });
}
