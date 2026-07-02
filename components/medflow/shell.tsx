"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, CalendarDays, Users, Stethoscope, ConciergeBell, CalendarRange,
  ClipboardList, FileText, Pill, FlaskConical, Scan, CreditCard, Boxes, BarChart3,
  UsersRound, MessageSquare, Settings, LifeBuoy, Search, Bell, Sun, Moon, Menu, X,
  Plus, Sparkles, ChevronsLeft, Command, ArrowRight, Check, LogOut, ChevronDown,
} from "lucide-react";
import { notifications as notifData } from "@/lib/medflow/data";
import { Avatar, cx } from "@/components/medflow/ui";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ size?: number | string; strokeWidth?: number | string }>; badgeKey?: "today" | "waiting"; live?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/medflow/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/medflow/appointments", label: "Appointments", icon: CalendarDays, badgeKey: "today" },
      { href: "/medflow/calendar", label: "Calendar", icon: CalendarRange },
      { href: "/medflow/reception", label: "Reception", icon: ConciergeBell, badgeKey: "waiting" },
    ],
  },
  {
    label: "Clinical",
    items: [
      { href: "/medflow/patients", label: "Patients", icon: Users, live: true },
      { href: "/medflow/doctors", label: "Doctors", icon: Stethoscope },
      { href: "/medflow/consultations", label: "Consultations", icon: ClipboardList },
      { href: "/medflow/records", label: "Medical Records", icon: FileText },
      { href: "/medflow/prescriptions", label: "Prescriptions", icon: Pill },
      { href: "/medflow/laboratory", label: "Laboratory", icon: FlaskConical },
      { href: "/medflow/radiology", label: "Radiology", icon: Scan },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/medflow/billing", label: "Billing", icon: CreditCard },
      { href: "/medflow/inventory", label: "Inventory", icon: Boxes },
      { href: "/medflow/reports", label: "Reports", icon: BarChart3, live: true },
      { href: "/medflow/staff", label: "Staff", icon: UsersRound },
      { href: "/medflow/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/settings", label: "Settings", icon: Settings, live: true },
      { href: "/medflow/help", label: "Help & Support", icon: LifeBuoy },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

function useClickOutside(cb: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);
  return ref;
}

/* ---------------- Theme ---------------- */
function useTheme() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  React.useEffect(() => {
    const saved = localStorage.getItem("mf-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);
  const toggle = () =>
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      localStorage.setItem("mf-theme", next);
      return next;
    });
  return { theme, toggle };
}

/* ---------------- Command Palette ---------------- */
type PaletteResult = { type: string; label: string; sub: string; href: string };

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [patientResults, setPatientResults] = React.useState<PaletteResult[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const pageMatches = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    const pages = ALL_ITEMS.map((i) => ({ type: "Navigate", label: i.label, sub: i.href, href: i.href }));
    if (!query) return pages.slice(0, 6);
    return pages.filter((r) => r.label.toLowerCase().includes(query) || r.sub.toLowerCase().includes(query));
  }, [q]);

  // Live patient search against the real API — same endpoint the Patients page uses.
  React.useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setPatientResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/patients?search=${encodeURIComponent(query)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : { data: [] }))
        .then((json) => {
          const rows = (json.data ?? []) as { id: string; name: string; phone: string }[];
          setPatientResults(
            rows.slice(0, 5).map((p) => ({ type: "Patient", label: p.name, sub: p.phone, href: `/medflow/patients/${p.id}` }))
          );
        })
        .catch(() => {});
    }, 220);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const results = React.useMemo(() => [...patientResults, ...pageMatches].slice(0, 8), [patientResults, pageMatches]);

  React.useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setPatientResults([]);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);
  React.useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={(e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && results[active]) go(results[active].href);
      if (e.key === "Escape") onClose();
    }}>
      <div className="mf-animate-fade absolute inset-0" style={{ background: "rgba(2,6,23,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="mf-card mf-animate-scale relative w-full max-w-xl overflow-hidden" style={{ boxShadow: "var(--mf-shadow-lg)", borderRadius: 20 }}>
        <div className="flex items-center gap-3 border-b px-4" style={{ borderColor: "var(--mf-border)" }}>
          <Search size={18} style={{ color: "var(--mf-text-3)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patients or pages…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: "var(--mf-text)" }}
          />
          <kbd className="rounded-md border px-1.5 py-0.5 text-[11px]" style={{ color: "var(--mf-text-3)", borderColor: "var(--mf-border)" }}>ESC</kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2 mf-thin-scroll">
          {results.length === 0 && (
            <div className="px-3 py-10 text-center text-sm" style={{ color: "var(--mf-text-2)" }}>No results for “{q}”.</div>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.label}-${i}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.href)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
              style={{ background: active === i ? "var(--mf-surface-hover)" : "transparent" }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--mf-primary-soft)", color: "var(--mf-primary)" }}>
                <ArrowRight size={15} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium" style={{ color: "var(--mf-text)" }}>{r.label}</span>
                <span className="block truncate text-xs" style={{ color: "var(--mf-text-3)" }}>{r.sub}</span>
              </span>
              <span className="rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}>{r.type}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 border-t px-4 py-2.5 text-[11px]" style={{ borderColor: "var(--mf-border)", color: "var(--mf-text-3)" }}>
          <span className="flex items-center gap-1"><kbd className="rounded border px-1" style={{ borderColor: "var(--mf-border)" }}>↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border px-1" style={{ borderColor: "var(--mf-border)" }}>↵</kbd> open</span>
          <span className="ml-auto flex items-center gap-1"><Search size={12} style={{ color: "var(--mf-primary)" }} /> Live patient search</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Notifications ---------------- */
function Notifications() {
  const [open, setOpen] = React.useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const unread = notifData.filter((n) => n.unread).length;
  const toneColor: Record<string, string> = {
    primary: "var(--mf-primary)", success: "var(--mf-success)", warning: "var(--mf-warning)", error: "var(--mf-error)", info: "var(--mf-info)",
  };
  return (
    <div className="relative" ref={ref}>
      <button className="mf-btn mf-btn-ghost mf-btn-icon relative" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ background: "var(--mf-error)", boxShadow: "0 0 0 2px var(--mf-surface)" }} />}
      </button>
      {open && (
        <div className="mf-card mf-animate-scale absolute right-0 top-12 z-50 w-[360px] overflow-hidden" style={{ boxShadow: "var(--mf-shadow-lg)" }}>
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--mf-border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>Notifications</span>
            <span className="mf-chip" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}>Preview</span>
          </div>
          <div className="max-h-[340px] overflow-y-auto mf-thin-scroll">
            {notifData.map((n) => (
              <div key={n.id} className="flex gap-3 border-b px-4 py-3 transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)", background: n.unread ? "var(--mf-surface-2)" : "transparent" }}>
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: toneColor[n.tone] }} />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium" style={{ color: "var(--mf-text)" }}>{n.title}</p>
                  <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{n.body}</p>
                  <p className="mt-0.5 text-[11px]" style={{ color: "var(--mf-text-3)" }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 text-center text-[13px] font-medium transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ color: "var(--mf-primary)" }}>
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- User menu ---------------- */
function UserMenu({ userName, clinicName }: { userName: string; clinicName: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const initials = userName.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "DR";
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-[var(--mf-surface-hover)]">
        <Avatar initials={initials} color="#2563eb" size={32} />
        <div className="hidden text-left leading-tight md:block">
          <p className="text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{userName}</p>
          <p className="text-[11px]" style={{ color: "var(--mf-text-3)" }}>{clinicName}</p>
        </div>
        <ChevronDown size={15} style={{ color: "var(--mf-text-3)" }} />
      </button>
      {open && (
        <div className="mf-card mf-animate-scale absolute right-0 top-12 z-50 w-56 overflow-hidden p-1.5" style={{ boxShadow: "var(--mf-shadow-lg)" }}>
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>{clinicName}</p>
          </div>
          <div className="my-1 h-px" style={{ background: "var(--mf-border)" }} />
          <Link href="/settings" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ color: "var(--mf-text-2)" }}>
            <Settings size={16} /> Clinic settings
          </Link>
          <Link href="/medflow/help" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ color: "var(--mf-text-2)" }}>
            <LifeBuoy size={16} /> Help center
          </Link>
          <div className="my-1 h-px" style={{ background: "var(--mf-border)" }} />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors hover:bg-[var(--mf-error-soft)]"
            style={{ color: "var(--mf-error)" }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function SidebarContent({
  collapsed,
  onNavigate,
  badges,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  badges: { today: number; waiting: number };
}) {
  const pathname = usePathname();
  return (
    <>
      <div className={cx("flex h-16 items-center gap-2.5 px-4", collapsed && "justify-center px-0")}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mf-brand-gradient text-white shadow-lg" style={{ boxShadow: "0 8px 20px -6px rgba(37,99,235,0.6)" }}>
          <Sparkles size={18} />
        </span>
        {!collapsed && (
          <div className="leading-none">
            <p className="text-[15px] font-bold tracking-tight" style={{ color: "var(--mf-text)" }}>MedFlow<span style={{ color: "var(--mf-primary)" }}> AI</span></p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--mf-text-3)" }}>Clinic OS</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 mf-thin-scroll">
        {NAV.map((group) => (
          <div key={group.label} className="mb-1 mt-4 first:mt-0">
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--mf-text-3)" }}>{group.label}</p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                const badgeValue = item.badgeKey === "today" ? badges.today : item.badgeKey === "waiting" ? badges.waiting : undefined;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={cx("group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-all", collapsed && "justify-center px-0")}
                    style={{
                      color: active ? "var(--mf-primary)" : "var(--mf-text-2)",
                      background: active ? "var(--mf-primary-soft)" : "transparent",
                    }}
                  >
                    {active && !collapsed && <span className="absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-full" style={{ width: 3, background: "var(--mf-primary)" }} />}
                    <Icon size={18} strokeWidth={active ? 2.3 : 2} />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && badgeValue !== undefined && (
                      <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold mf-nums" style={{ background: active ? "var(--mf-primary)" : "var(--mf-surface-hover)", color: active ? "#fff" : "var(--mf-text-2)" }}>
                        {badgeValue}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-3">
          <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: "var(--mf-primary-soft)" }}>
            <div className="absolute inset-0 mf-mesh opacity-80" />
            <div className="relative">
              <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--mf-primary)" }}>
                <Sparkles size={15} /> MedFlow AI
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--mf-text-2)" }}>AI note-drafting and schedule optimization are coming soon — this preview shows where they'll live.</p>
              <button disabled className="mf-btn mf-btn-outline mf-btn-sm mt-3 w-full opacity-70">Coming soon</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- Shell ---------------- */
export function Shell({
  children,
  clinicName,
  userName,
  todayCount,
  waitingCount,
}: {
  children: React.ReactNode;
  clinicName: string;
  userName: string;
  todayCount: number;
  waitingCount: number;
}) {
  const { theme, toggle } = useTheme();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const pathname = usePathname();
  const badges = { today: todayCount, waiting: waitingCount };

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => setMobileOpen(false), [pathname]);

  const current = ALL_ITEMS.find((i) => pathname === i.href || pathname.startsWith(i.href + "/"));

  return (
    <div className={cx("mf-scope", theme === "dark" && "dark")} dir="ltr" style={{ minHeight: "100vh", background: "var(--mf-bg)" }}>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className="sticky top-0 hidden h-screen shrink-0 flex-col border-r transition-[width] duration-300 lg:flex"
          style={{ width: collapsed ? 76 : 264, background: "var(--mf-surface)", borderColor: "var(--mf-border)" }}
        >
          <SidebarContent collapsed={collapsed} badges={badges} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="mf-animate-fade absolute inset-0" style={{ background: "rgba(2,6,23,0.5)" }} onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col border-r" style={{ background: "var(--mf-surface)", borderColor: "var(--mf-border)", animation: "mf-fade 0.2s ease" }}>
              <button className="mf-btn mf-btn-ghost mf-btn-icon absolute right-2 top-3" onClick={() => setMobileOpen(false)}><X size={18} /></button>
              <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} badges={badges} />
            </aside>
          </div>
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="mf-glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 md:px-6" style={{ borderColor: "var(--mf-border)" }}>
            <button className="mf-btn mf-btn-ghost mf-btn-icon lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
            <button className="mf-btn mf-btn-ghost mf-btn-icon hidden lg:flex" onClick={() => setCollapsed((c) => !c)} title="Collapse sidebar">
              <ChevronsLeft size={18} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
            </button>

            <div className="hidden items-center gap-1.5 md:flex">
              <span className="text-[13px]" style={{ color: "var(--mf-text-3)" }}>MedFlow</span>
              <span style={{ color: "var(--mf-text-3)" }}>/</span>
              <span className="text-[13px] font-semibold" style={{ color: "var(--mf-text)" }}>{current?.label ?? "Dashboard"}</span>
            </div>

            <button
              onClick={() => setPaletteOpen(true)}
              className="group ml-auto flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:bg-[var(--mf-surface-hover)] md:ml-6 md:h-10 md:w-72 md:justify-start md:gap-2.5 md:px-3"
              style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)", color: "var(--mf-text-3)" }}
            >
              <Search size={17} />
              <span className="hidden text-[13px] md:inline">Search everything…</span>
              <span className="ml-auto hidden items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[11px] font-medium md:flex" style={{ borderColor: "var(--mf-border)" }}>
                <Command size={11} /> K
              </span>
            </button>

            <div className="flex items-center gap-1 md:ml-2">
              <Link href="/medflow/appointments" className="mf-btn mf-btn-primary mf-btn-sm hidden sm:flex"><Plus size={16} /> New</Link>
              <button className="mf-btn mf-btn-ghost mf-btn-icon" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Notifications />
              <div className="mx-1 hidden h-6 w-px sm:block" style={{ background: "var(--mf-border)" }} />
              <UserMenu userName={userName} clinicName={clinicName} />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
