import type { Prisma } from "@prisma/client";

/** A clinic is publicly listed/bookable once it has a complete profile and admin approval. */
export const PUBLISHED_CLINIC_WHERE: Prisma.ClinicWhereInput = {
  specialty: { not: null },
  city: { not: null },
  status: "APPROVED",
};
