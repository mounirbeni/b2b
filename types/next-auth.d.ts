import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      clinicName?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    clinicName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    clinicName?: string | null;
  }
}
