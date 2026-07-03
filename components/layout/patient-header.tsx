"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";

export function PatientHeader({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6">
      <BrandLogo href="/search" />
      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-medium text-slate-600 sm:inline">{userName}</span>
        <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/patient/login" })}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
