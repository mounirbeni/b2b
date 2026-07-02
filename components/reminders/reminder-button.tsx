"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ReminderButton({ appointmentId }: { appointmentId: string }) {
  const [loading, setLoading] = useState(false);

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
      toast.success("تم إرسال التذكير عبر واتساب");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إرسال التذكير");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="icon" title="إرسال تذكير" disabled={loading} onClick={handleSend}>
      <MessageCircle className="h-4 w-4" />
    </Button>
  );
}
