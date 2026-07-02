import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      clinicId: string;
      clinicName?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    clinicId: string;
    clinicName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    clinicId: string;
    clinicName?: string | null;
  }
}
