import twilio from "twilio";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/date-utils";

interface SendResult {
  success: boolean;
  sid?: string;
  error?: string;
}

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

/** Sends a WhatsApp message via Twilio. `to` should be a raw phone number (e.g. +2126...). */
export async function sendWhatsAppMessage(to: string, body: string): Promise<SendResult> {
  const client = getClient();
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!client || !from) {
    return { success: false, error: "Twilio credentials are not configured" };
  }

  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  try {
    const message = await client.messages.create({
      from,
      to: normalizedTo,
      body,
    });
    return { success: true, sid: message.sid };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error sending WhatsApp message";
    return { success: false, error };
  }
}

interface TemplateParams {
  name: string;
  date: Date | string;
  time: Date | string;
  clinicName: string;
  phone?: string;
  waitingNumber?: number;
  waitingMinutes?: number;
}

export const whatsappTemplates = {
  confirmation: ({ name, date, time, clinicName }: TemplateParams) =>
    `مرحباً ${name}, تم تأكيد موعدك يوم ${formatDateDisplay(date)} الساعة ${formatTimeDisplay(time)} مع ${clinicName}. للإلغاء رد بـ '2'`,

  reminder: ({ date, time, clinicName }: TemplateParams) =>
    `تذكير: موعدك غداً ${formatDateDisplay(date)} الساعة ${formatTimeDisplay(time)} مع ${clinicName}. نرجو الحضور في الموعد.`,

  waiting: ({ waitingNumber, waitingMinutes }: TemplateParams) =>
    `تم تسجيل دخولك. رقمك في الانتظار: ${waitingNumber ?? "-"}. الوقت المنتظر: ~${waitingMinutes ?? "-"} دقيقة.`,

  completed: ({ clinicName, phone }: TemplateParams) =>
    `شكراً لزيارتك ${clinicName}. نتمنى لك الشفاء العاجل. للاستفسار: ${phone ?? ""}`,
};
