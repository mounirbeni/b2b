import Link from "next/link";

/** MBN Health logomark + wordmark — the single source of the brand across the
 * public site, auth screens and (in its own styled form) the clinic app. */
export function BrandLogo({ size = 34, href = "/", className = "" }: { size?: number; href?: string | null; className?: string }) {
  const mark = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative flex shrink-0 items-center justify-center rounded-[11px]"
        style={{ width: size, height: size, boxShadow: "0 6px 16px -6px rgba(37,99,235,0.5)" }}
      >
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
          <defs>
            <linearGradient id="brand-mark" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="10.5" fill="url(#brand-mark)" />
          <path d="M18 9.5c-.7 0-1.3.5-1.4 1.2l-.7 4.2-4.2.7c-.8.1-1.3.8-1.2 1.6.1.6.6 1.1 1.2 1.2l4.2.7.7 4.2c.1.8.9 1.3 1.6 1.2.6-.1 1.1-.6 1.2-1.2l.7-4.2 4.2-.7c.8-.1 1.3-.9 1.2-1.6-.1-.6-.6-1.1-1.2-1.2l-4.2-.7-.7-4.2c-.1-.7-.7-1.2-1.4-1.2Z" fill="#fff" fillOpacity="0.95" />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-slate-900">
        MBN<span className="text-primary"> Health</span>
      </span>
    </span>
  );
  if (href === null) return mark;
  return <Link href={href} aria-label="MBN Health">{mark}</Link>;
}
