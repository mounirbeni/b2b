import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "clinic" | "patient";
      clinicId?: string;
      clinicName?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "clinic" | "patient";
    clinicId?: string;
    clinicName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "clinic" | "patient";
    clinicId?: string;
    clinicName?: string | null;
  }
}
