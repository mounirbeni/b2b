import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { combineDateAndTime } from "@/lib/date-utils";
import { isRateLimited } from "@/lib/rate-limit";
import { sendWhatsAppMessage, whatsappTemplates } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "patient") {
    return NextResponse.json({ error: "يجب تسجيل الدخول كمريض للحجز" }, { status: 401 });
  }

  if (isRateLimited(`booking:${session.user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: "عدد كبير من الطلبات، حاول لاحقاً" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }

  const clinic = await prisma.clinic.findUnique({ where: { slug: parsed.data.clinicSlug } });
  if (!clinic || !clinic.specialty || !clinic.city || clinic.status !== "APPROVED") {
    return NextResponse.json({ error: "العيادة غير موجودة" }, { status: 404 });
  }

  const patientAccount = await prisma.patientAccount.findUnique({ where: { id: session.user.id } });
  if (!patientAccount) {
    return NextResponse.json({ error: "الحساب غير موجود" }, { status: 404 });
  }

  const dateTime = combineDateAndTime(new Date(parsed.data.date), parsed.data.time);
  if (dateTime < new Date()) {
    return NextResponse.json({ error: "لا يمكن الحجز في وقت ماضٍ" }, { status: 400 });
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      let patient = await tx.patient.findFirst({
        where: { clinicId: clinic.id, phone: patientAccount.phone },
      });
      if (!patient) {
        patient = await tx.patient.create({
          data: {
            clinicId: clinic.id,
            name: patientAccount.name,
            phone: patientAccount.phone,
            email: patientAccount.email,
          },
        });
      }

      return tx.appointment.create({
        data: {
          clinicId: clinic.id,
          patientId: patient.id,
          patientAccountId: patientAccount.id,
          dateTime,
        },
        include: { patient: true },
      });
    });

    const message = whatsappTemplates.confirmation({
      name: appointment.patient.name,
      date: appointment.dateTime,
      time: appointment.dateTime,
      clinicName: clinic.name,
    });
    const statusCallbackUrl = `${req.nextUrl.origin}/api/whatsapp/status`;
    const result = await sendWhatsAppMessage(appointment.patient.phone, message, statusCallbackUrl);
    await prisma.reminderLog.create({
      data: {
        type: "WHATSAPP",
        status: result.success ? "SENT" : "FAILED",
        message,
        sid: result.sid,
        errorMessage: result.error,
        appointmentId: appointment.id,
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (err) {
    const isConflict =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
    if (isConflict) {
      return NextResponse.json({ error: "هذه الفتحة تم حجزها للتو، اختر وقتاً آخر" }, { status: 409 });
    }
    return NextResponse.json({ error: "فشل الحجز" }, { status: 500 });
  }
}
