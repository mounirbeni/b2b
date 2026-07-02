import * as React from "react";
import { STATUS_META, type Status } from "@/lib/medflow/data";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* Avatar with gradient-tinted initials */
export function Avatar({
  initials,
  color = "var(--mf-primary)",
  size = 40,
  ring = false,
  online,
}: {
  initials: string;
  color?: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
}) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        className="inline-flex items-center justify-center rounded-full font-semibold"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.36,
          color,
          background: `color-mix(in srgb, ${color} 16%, var(--mf-surface))`,
          boxShadow: ring ? `0 0 0 2px var(--mf-surface), 0 0 0 3.5px ${color}` : undefined,
          letterSpacing: "-0.02em",
        }}
      >
        {initials}
      </span>
      {online !== undefined && (
        <span
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: size * 0.28,
            height: size * 0.28,
            background: online ? "var(--mf-success)" : "var(--mf-text-3)",
            boxShadow: "0 0 0 2px var(--mf-surface)",
          }}
        />
      )}
    </span>
  );
}

const TONES: Record<string, { fg: string; bg: string }> = {
  primary: { fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)" },
  success: { fg: "var(--mf-success)", bg: "var(--mf-success-soft)" },
  warning: { fg: "var(--mf-warning)", bg: "var(--mf-warning-soft)" },
  error: { fg: "var(--mf-error)", bg: "var(--mf-error-soft)" },
  info: { fg: "var(--mf-info)", bg: "var(--mf-info-soft)" },
  neutral: { fg: "var(--mf-text-2)", bg: "var(--mf-surface-hover)" },
};

export function Pill({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  dot?: boolean;
}) {
  const t = TONES[tone];
  return (
    <span className="mf-chip" style={{ color: t.fg, background: t.bg }}>
      {dot && <span className="mf-dot" style={{ background: t.fg }} />}
      {children}
    </span>
  );
}

export function StatusPill({ status, live = false }: { status: Status; live?: boolean }) {
  const m = STATUS_META[status];
  return (
    <span className="mf-chip" style={{ color: m.fg, background: m.bg }}>
      <span className={cx("mf-dot", live && "mf-live")} style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
  icon,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mf-animate-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        {icon && (
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}
          >
            {icon}
          </span>
        )}
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--mf-text)" }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm" style={{ color: "var(--mf-text-2)" }}>{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
  hover = false,
  padded = true,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padded?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cx("mf-card", hover && "mf-card-hover", padded && "p-5", className)} style={style}>
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cx("mf-card overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-5">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--mf-text)" }}>{title}</h3>}
            {subtitle && <p className="mt-0.5 text-[13px]" style={{ color: "var(--mf-text-2)" }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cx("px-5 pb-5", bodyClassName)}>{children}</div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mf-animate-in flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl"
        style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-3)" }}
      >
        <div className="absolute inset-0 rounded-3xl mf-mesh opacity-60" />
        <div className="relative">{icon}</div>
      </div>
      <h3 className="text-base font-semibold" style={{ color: "var(--mf-text)" }}>{title}</h3>
      <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--mf-text-2)" }}>{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, color = "var(--mf-primary)", track }: { value: number; color?: string; track?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: track ?? "var(--mf-surface-hover)" }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function Delta({ value, invert = false }: { value: number; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  const good = positive;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold mf-nums"
      style={{
        color: good ? "var(--mf-success)" : "var(--mf-error)",
        background: good ? "var(--mf-success-soft)" : "var(--mf-error-soft)",
      }}
    >
      {value > 0 ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
}

/* Simple presentational KPI stat tile */
export function StatTile({
  label,
  value,
  icon,
  delta,
  tone = "primary",
  spark,
  invertDelta = false,
  children,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  delta?: number;
  tone?: keyof typeof TONES;
  spark?: React.ReactNode;
  invertDelta?: boolean;
  children?: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div className="mf-card mf-card-hover group relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--mf-text-2)" }}>{label}</p>
          <p className="mt-1.5 text-[26px] font-bold leading-none tracking-tight mf-nums" style={{ color: "var(--mf-text)" }}>
            {value}
          </p>
        </div>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ color: t.fg, background: t.bg }}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        {delta !== undefined ? <Delta value={delta} invert={invertDelta} /> : <span />}
        {spark && <div className="opacity-90">{spark}</div>}
      </div>
      {children}
    </div>
  );
}
