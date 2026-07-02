import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

type ClinicSession = Session & {
  user: Session["user"] & { clinicId: string };
};

/** Resolves the session only if it belongs to a clinic owner with a linked clinic. */
export async function requireClinicSession(): Promise<ClinicSession | null> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "clinic" || !session.user.clinicId) {
    return null;
  }
  return session as ClinicSession;
}
