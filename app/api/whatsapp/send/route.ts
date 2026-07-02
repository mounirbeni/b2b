import { NextRequest, NextResponse } from "next/server";
import { requireClinicSession } from "@/lib/auth-guard";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await requireClinicSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  if (isRateLimited(`whatsapp:${session.user.id}`, 5, 60_000)) {
    return NextResponse.json({ error: "عدد كبير من الطلبات، حاول لاحقاً" }, { status: 429 });
  }

  const body = await req.json();
  const { to, message } = body as { to?: string; message?: string };

  if (!to || !message) {
    return NextResponse.json({ error: "الهاتف والرسالة مطلوبان" }, { status: 400 });
  }

  const result = await sendWhatsAppMessage(to, message);

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "فشل إرسال الرسالة" }, { status: 502 });
  }

  return NextResponse.json({ success: true, sid: result.sid });
}
