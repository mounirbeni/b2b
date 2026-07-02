import Link from "next/link";
import { Users, UserPlus, Search, Phone, Eye } from "lucide-react";
import { requireClinicSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { getPatientsPage, initialsOf, colorFor, calcAge } from "@/lib/medflow/live";
import { Avatar, StatTile, PageHeader, Pill } from "@/components/medflow/ui";

const PAGE_SIZE = 20;

export default async function PatientsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const session = await requireClinicSession();
  const clinicId = session!.user.clinicId;
  const search = searchParams.q?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.page ?? "1"));

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ patients, total }, totalPatients, newThisMonth] = await Promise.all([
    getPatientsPage(clinicId, search, page),
    prisma.patient.count({ where: { clinicId } }),
    prisma.patient.count({ where: { clinicId, createdAt: { gte: monthStart } } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <PageHeader title="Patients" subtitle="Your clinic's patient records" icon={<Users size={20} />}>
        <Link href="/patients/new" className="mf-btn mf-btn-primary"><UserPlus size={16} /> New Patient</Link>
      </PageHeader>

      <div className="mf-stagger grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label="Total Patients" value={totalPatients.toLocaleString()} icon={<Users size={18} />} tone="primary" />
        <StatTile label="New This Month" value={String(newThisMonth)} icon={<UserPlus size={18} />} tone="success" />
        <StatTile label="Matching Search" value={String(total)} icon={<Search size={18} />} tone="info" />
      </div>

      <div className="mf-card overflow-hidden p-0">
        <form className="flex flex-wrap items-center gap-3 border-b p-4" style={{ borderColor: "var(--mf-border)" }}>
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--mf-text-3)" }} />
            <input name="q" defaultValue={search} className="mf-input pl-9" placeholder="Search by name or phone…" />
          </div>
          <button type="submit" className="mf-btn mf-btn-outline mf-btn-sm">Search</button>
        </form>

        {patients.length === 0 ? (
          <p className="px-5 py-16 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>
            {search ? `No patients match "${search}".` : "No patients yet — register your first patient to get started."}
          </p>
        ) : (
          <div className="overflow-x-auto mf-thin-scroll">
            <table className="w-full min-w-[780px] border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--mf-border)" }}>
                  {["Patient", "Phone", "Age / Gender", "Last Visit", "Visits", ""].map((c) => (
                    <th key={c} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mf-text-3)" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => {
                  const age = calcAge(p.birthDate);
                  const lastVisit = p.appointments[0]?.dateTime;
                  return (
                    <tr key={p.id} className="group border-b transition-colors hover:bg-[var(--mf-surface-hover)]" style={{ borderColor: "var(--mf-border-soft)" }}>
                      <td className="px-5 py-3">
                        <Link href={`/medflow/patients/${p.id}`} className="flex items-center gap-3">
                          <Avatar initials={initialsOf(p.name)} color={colorFor(p.id)} size={38} />
                          <div>
                            <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>{p.name}</p>
                            {p.email && <p className="text-[12px]" style={{ color: "var(--mf-text-3)" }}>{p.email}</p>}
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-[13px] mf-nums" style={{ color: "var(--mf-text-2)" }}>{p.phone}</td>
                      <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                        {age !== null ? `${age} · ` : ""}{p.gender === "MALE" ? "Male" : p.gender === "FEMALE" ? "Female" : "—"}
                      </td>
                      <td className="px-5 py-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                        {lastVisit ? new Date(lastVisit).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3"><Pill tone="neutral">{p.appointments.length > 0 ? "Active" : "No visits"}</Pill></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <a href={`tel:${p.phone}`} className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><Phone size={15} /></a>
                          <Link href={`/medflow/patients/${p.id}`} className="mf-btn mf-btn-ghost mf-btn-icon h-8 w-8"><Eye size={15} /></Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3.5 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
          <span>
            Showing <b style={{ color: "var(--mf-text)" }}>{patients.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + patients.length}</b> of {total} patients
          </span>
          <div className="flex items-center gap-1.5">
            <Link
              href={`/medflow/patients?q=${encodeURIComponent(search)}&page=${Math.max(1, page - 1)}`}
              className="mf-btn mf-btn-outline mf-btn-sm"
              aria-disabled={page <= 1}
              style={page <= 1 ? { pointerEvents: "none", opacity: 0.5 } : undefined}
            >
              Previous
            </Link>
            <Link
              href={`/medflow/patients?q=${encodeURIComponent(search)}&page=${Math.min(totalPages, page + 1)}`}
              className="mf-btn mf-btn-outline mf-btn-sm"
              aria-disabled={page >= totalPages}
              style={page >= totalPages ? { pointerEvents: "none", opacity: 0.5 } : undefined}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
