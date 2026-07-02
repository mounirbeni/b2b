"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PatientHeader({ userName }: { userName: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <Link href="/search" className="text-lg font-bold text-primary">
        دليل العيادات
      </Link>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-600 sm:inline">{userName}</span>
        <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/patient/login" })}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
