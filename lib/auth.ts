import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { normalizeMoroccanPhone } from "@/lib/phone";
import { isRateLimited } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        if (isRateLimited(`login:clinic:${email.toLowerCase().trim()}`, 5, 60_000)) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          include: { clinic: true },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        const adminEmails = (process.env.ADMIN_EMAILS ?? "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          return { id: user.id, name: user.name, email: user.email, role: "admin" };
        }

        if (!user.clinic) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "clinic",
          clinicId: user.clinic.id,
          clinicName: user.clinic.name,
        };
      },
    }),
    Credentials({
      id: "patient-credentials",
      name: "Patient",
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        const identifier = credentials?.identifier as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!identifier || !password) return null;

        if (isRateLimited(`login:patient:${identifier.toLowerCase().trim()}`, 5, 60_000)) {
          return null;
        }

        const trimmed = identifier.trim();
        const patient = await prisma.patientAccount.findFirst({
          where: {
            OR: [{ phone: normalizeMoroccanPhone(trimmed) }, { email: trimmed.toLowerCase() }],
          },
        });

        if (!patient) return null;

        const valid = await bcrypt.compare(password, patient.password);
        if (!valid) return null;

        return {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          role: "patient",
        };
      },
    }),
  ],
});
