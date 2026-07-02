"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReminderLog } from "@/types";

const STATUS_TITLES: Record<string, string> = {
  SENT: "تم الإرسال لواتساب، بانتظار تأكيد التسليم",
  DELIVERED: "تم تسليم الرسالة",
  FAILED: "فشل تسليم الرسالة",
};

const STATUS_COLORS: Record<string, string> = {
  SENT: "text-slate-500",
  DELIVERED: "text-green-600",
  FAILED: "text-destructive",
};

export function ReminderButton({
  appointmentId,
  reminders,
  onSent,
}: {
  appointmentId: string;
  reminders?: ReminderLog[];
  onSent?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const lastReminder = reminders
    ?.filter((r) => r.type === "WHATSAPP")
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];

  async function handleSend() {
    setLoading(true);
    try {
      const res = await fetch("/api/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "فشل إرسال التذكير");
      }
      toast.success("تم إرسال التذكير عبر واتساب، سيتم تحديث حالة التسليم تلقائياً");
      onSent?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إرسال التذكير");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      title={lastReminder ? STATUS_TITLES[lastReminder.status] ?? "إرسال تذكير" : "إرسال تذكير"}
      disabled={loading}
      onClick={handleSend}
    >
      <MessageCircle
        className={cn("h-4 w-4", lastReminder && STATUS_COLORS[lastReminder.status])}
      />
    </Button>
  );
}
