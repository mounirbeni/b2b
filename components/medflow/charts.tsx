"use client";

import * as React from "react";

/* ---------------------------------------------------------------------------
   Sparkline — tiny trend line for KPI tiles
--------------------------------------------------------------------------- */
export function Sparkline({
  data,
  color = "var(--mf-primary)",
  height = 40,
  width = 120,
  fill = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  fill?: boolean;
}) {
  const id = React.useId();
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 6) - 3]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#sg-${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   AreaChart — dual series with hover crosshair
--------------------------------------------------------------------------- */
export function AreaChart({
  data,
  height = 240,
  colorA = "var(--mf-c1)",
  colorB = "var(--mf-c2)",
  labelA = "Revenue",
  labelB = "Profit",
}: {
  data: { label: string; a: number; b: number }[];
  height?: number;
  colorA?: string;
  colorB?: string;
  labelA?: string;
  labelB?: string;
}) {
  const id = React.useId();
  const W = 640;
  const H = height;
  const padX = 8;
  const padTop = 16;
  const padBottom = 28;
  const [hover, setHover] = React.useState<number | null>(null);
  const max = Math.max(...data.map((d) => Math.max(d.a, d.b))) * 1.15;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;
  const x = (i: number) => padX + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padTop + innerH - (v / max) * innerH;

  const path = (key: "a" | "b") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
  const areaA = `${path("a")} L${x(data.length - 1)},${padTop + innerH} L${x(0)},${padTop + innerH} Z`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round(((rel - padX) / innerW) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, i)));
        }}
      >
        <defs>
          <linearGradient id={`ar-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorA} stopOpacity="0.24" />
            <stop offset="100%" stopColor={colorA} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={padX} x2={W - padX} y1={padTop + innerH * g} y2={padTop + innerH * g} stroke="var(--mf-border)" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
        ))}
        <path d={areaA} fill={`url(#ar-${id})`} />
        <path d={path("a")} fill="none" stroke={colorA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path("b")} fill="none" stroke={colorB} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 0" opacity="0.9" />
        {data.map((d, i) => (
          <text key={d.label} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--mf-text-3)">
            {d.label}
          </text>
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padTop} y2={padTop + innerH} stroke="var(--mf-primary)" strokeWidth="1" opacity="0.35" />
            <circle cx={x(hover)} cy={y(data[hover].a)} r="4.5" fill="var(--mf-surface)" stroke={colorA} strokeWidth="2.5" />
            <circle cx={x(hover)} cy={y(data[hover].b)} r="4.5" fill="var(--mf-surface)" stroke={colorB} strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="mf-card mf-animate-scale pointer-events-none absolute z-10 -translate-x-1/2 px-3 py-2 text-xs"
          style={{ left: `${(x(hover) / W) * 100}%`, top: 4, boxShadow: "var(--mf-shadow-lg)" }}
        >
          <div className="mb-1 font-semibold" style={{ color: "var(--mf-text)" }}>{data[hover].label}</div>
          <div className="flex items-center gap-2" style={{ color: "var(--mf-text-2)" }}>
            <span className="mf-dot" style={{ background: colorA }} /> {labelA} <b className="mf-nums" style={{ color: "var(--mf-text)" }}>${data[hover].a}k</b>
          </div>
          <div className="flex items-center gap-2" style={{ color: "var(--mf-text-2)" }}>
            <span className="mf-dot" style={{ background: colorB }} /> {labelB} <b className="mf-nums" style={{ color: "var(--mf-text)" }}>${data[hover].b}k</b>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   BarChart — animated columns
--------------------------------------------------------------------------- */
export function BarChart({
  data,
  height = 200,
  color = "var(--mf-primary)",
}: {
  data: { label: string; v: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.v)) * 1.15;
  const [active, setActive] = React.useState<number | null>(null);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
          <div className="relative flex w-full flex-1 items-end justify-center">
            {active === i && (
              <div className="mf-card mf-animate-scale absolute -top-1 z-10 -translate-y-full px-2.5 py-1 text-xs font-semibold mf-nums" style={{ boxShadow: "var(--mf-shadow-md)" }}>
                {d.v}
              </div>
            )}
            <div
              className="w-full max-w-[38px] rounded-t-lg transition-all duration-300"
              style={{
                height: `${(d.v / max) * 100}%`,
                background: active === i ? color : `color-mix(in srgb, ${color} 78%, transparent)`,
                transformOrigin: "bottom",
                animation: `mf-rise 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
              }}
            />
          </div>
          <span className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   DonutChart — with center label + legend
--------------------------------------------------------------------------- */
export function DonutChart({
  data,
  size = 180,
  thickness = 22,
  centerLabel,
  centerSub,
}: {
  data: { label: string; v: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = data.reduce((s, d) => s + d.v, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const [active, setActive] = React.useState<number | null>(null);
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {data.map((d, i) => {
            const len = (d.v / total) * c;
            const seg = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={active === i ? thickness + 4 : thickness}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                style={{ transition: "stroke-width 0.2s ease", cursor: "pointer" }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold mf-nums" style={{ color: "var(--mf-text)" }}>
            {active !== null ? `${Math.round((data[active].v / total) * 100)}%` : centerLabel}
          </span>
          <span className="text-xs" style={{ color: "var(--mf-text-2)" }}>{active !== null ? data[active].label : centerSub}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2.5 text-sm" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} style={{ cursor: "pointer" }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span style={{ color: "var(--mf-text-2)" }}>{d.label}</span>
            <span className="ml-auto font-semibold mf-nums" style={{ color: "var(--mf-text)" }}>{d.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   RadialGauge — single metric ring
--------------------------------------------------------------------------- */
export function RadialGauge({
  value,
  size = 120,
  thickness = 12,
  color = "var(--mf-primary)",
  label,
}: {
  value: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const len = (value / 100) * c;
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mf-border)" strokeWidth={thickness} opacity="0.6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${len} ${c}`}
          style={{ animation: `mf-draw 1s ease both`, ["--mf-dash" as string]: c }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold mf-nums" style={{ color: "var(--mf-text)" }}>{value}%</span>
        {label && <span className="text-[11px]" style={{ color: "var(--mf-text-2)" }}>{label}</span>}
      </div>
    </div>
  );
}
