"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-semibold">حدث خطأ غير متوقع</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  );
}
