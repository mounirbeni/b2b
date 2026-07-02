import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";

const STATUS_MAP: Record<string, string> = {
  queued: "SENT",
  sent: "SENT",
  delivered: "DELIVERED",
  read: "DELIVERED",
  failed: "FAILED",
  undelivered: "FAILED",
};

/** Twilio calls this webhook as a WhatsApp message moves through queued -> sent -> delivered/failed. */
export async function POST(req: NextRequest) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = req.headers.get("x-twilio-signature");

  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  if (authToken) {
    if (!signature || !twilio.validateRequest(authToken, signature, req.url, params)) {
      return NextResponse.json({ error: "توقيع غير صالح" }, { status: 403 });
    }
  }

  const { MessageSid, MessageStatus, ErrorMessage } = params;
  if (!MessageSid || !MessageStatus) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const status = STATUS_MAP[MessageStatus] ?? "SENT";

  await prisma.reminderLog.updateMany({
    where: { sid: MessageSid },
    data: { status, errorMessage: ErrorMessage ?? null },
  });

  return new NextResponse(null, { status: 204 });
}
