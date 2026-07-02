"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-semibold">حدث خطأ في النظام</p>
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" onClick={reset}>
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
