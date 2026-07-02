import { headers } from "next/headers";

/** Best-effort client identifier for rate limiting in Server Actions (no direct request object there). */
export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
