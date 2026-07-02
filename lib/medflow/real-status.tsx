import type { Status } from "@/types";

/** Visual metadata for the REAL appointment status enum (from Prisma), used by
 * every MedFlow page wired to live data. Kept separate from lib/medflow/data.ts's
 * demo Status type, which only backs the still-mock modules (Billing, Lab, etc). */
export const REAL_STATUS_META: Record<Status, { label: string; fg: string; bg: string; dot: string }> = {
  SCHEDULED: { label: "Scheduled", fg: "var(--mf-info)", bg: "var(--mf-info-soft)", dot: "var(--mf-info)" },
  CONFIRMED: { label: "Confirmed", fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)", dot: "var(--mf-primary)" },
  WAITING: { label: "Waiting", fg: "var(--mf-warning)", bg: "var(--mf-warning-soft)", dot: "var(--mf-warning)" },
  IN_PROGRESS: { label: "In Consultation", fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)", dot: "var(--mf-primary)" },
  COMPLETED: { label: "Completed", fg: "var(--mf-success)", bg: "var(--mf-success-soft)", dot: "var(--mf-success)" },
  NO_SHOW: { label: "No-show", fg: "var(--mf-text-2)", bg: "var(--mf-surface-hover)", dot: "var(--mf-text-3)" },
  CANCELLED: { label: "Cancelled", fg: "var(--mf-error)", bg: "var(--mf-error-soft)", dot: "var(--mf-error)" },
};

export function RealStatusPill({ status, live = false }: { status: Status; live?: boolean }) {
  const m = REAL_STATUS_META[status];
  return (
    <span className="mf-chip" style={{ color: m.fg, background: m.bg }}>
      <span className={live ? "mf-dot mf-live" : "mf-dot"} style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}
