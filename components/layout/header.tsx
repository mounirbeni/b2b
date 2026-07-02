"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  clinicName: string;
  userName: string;
}

export function Header({ clinicName, userName }: HeaderProps) {
  const initials = userName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div>
        <p className="text-sm font-semibold">{clinicName}</p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm text-slate-600 sm:inline">{userName}</span>
        <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
