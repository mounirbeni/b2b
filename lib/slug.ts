import { randomBytes } from "crypto";

/** Generates a short random URL-safe slug (clinic names are Arabic, so we don't transliterate). */
export function generateSlug(prefix = "clinic"): string {
  return `${prefix}-${randomBytes(5).toString("hex")}`;
}
