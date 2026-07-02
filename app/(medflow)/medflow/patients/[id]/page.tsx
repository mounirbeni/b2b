import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft, Phone, Mail, MapPin, Calendar, CalendarPlus, FileText,
} from "lucide-react";
import { requireClinicSession } from "@/lib/auth-guard";
import { getPatientDetail, initialsOf, colorFor, calcAge } from "@/lib/medflow/live";
import { Avatar, SectionCard, Pill } from "@/components/medflow/ui";
import { RealStatusPill } from "@/lib/medflow/real-status";
import type { Status } from "@/types";

export default async function PatientProfile({ params }: { params: { id: string } }) {
  const session = await requireClinicSession();
  const patient = await getPatientDetail(session!.user.clinicId, params.id);
  if (!patient) notFound();

  const age = calcAge(patient.birthDate);
  const upcoming = patient.appointments.filter((a) => new Date(a.dateTime) >= new Date() && a.status !== "CANCELLED");
  const past = patient.appointments.filter((a) => !upcoming.includes(a));

  return (
    <div className="space-y-6">
      <Link href="/medflow/patients" className="inline-flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--mf-text-2)" }}>
        <ChevronLeft size={16} /> Back to patients
      </Link>

      <div className="mf-animate-in relative overflow-hidden rounded-3xl border p-6" style={{ borderColor: "var(--mf-border)", background: "var(--mf-surface)" }}>
        <div className="absolute inset-x-0 top-0 h-24 mf-brand-gradient opacity-90" />
        <div className="relative flex flex-col gap-5 pt-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div style={{ boxShadow: "0 0 0 4px var(--mf-surface)" }} className="rounded-full">
              <Avatar initials={initialsOf(patient.name)} color={colorFor(patient.id)} size={84} />
            </div>
            <div className="pb-1">
              <h1 className="text-[24px] font-bold tracking-tight" style={{ color: "var(--mf-text)" }}>{patient.name}</h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                {age !== null && <span className="flex items-center gap-1"><Calendar size={13} /> {age} yrs</span>}
                {patient.gender && <span>{patient.gender === "MALE" ? "Male" : "Female"}</span>}
                <span>Patient since {patient.createdAt.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${patient.phone}`} className="mf-btn mf-btn-outline"><Phone size={16} /> Call</a>
            <Link href="/medflow/appointments" className="mf-btn mf-btn-primary"><CalendarPlus size={16} /> Book Visit</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Upcoming Appointments" bodyClassName="px-0 pb-0">
            {upcoming.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No upcoming appointments.</p>
            ) : (
              upcoming.map((appt) => (
                <div key={appt.id} className="flex items-center gap-3 border-t px-5 py-3" style={{ borderColor: "var(--mf-border-soft)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>
                      {new Date(appt.dateTime).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>
                      {new Date(appt.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {appt.type} · {appt.duration} min
                    </p>
                  </div>
                  <RealStatusPill status={appt.status as Status} />
                </div>
              ))
            )}
          </SectionCard>

          <SectionCard title="Visit History" bodyClassName="px-0 pb-0">
            {past.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13px]" style={{ color: "var(--mf-text-2)" }}>No past visits yet.</p>
            ) : (
              past.map((appt) => (
                <div key={appt.id} className="flex items-start gap-3 border-t px-5 py-3" style={{ borderColor: "var(--mf-border-soft)" }}>
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--mf-surface-2)", color: "var(--mf-text-2)" }}><FileText size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--mf-text)" }}>
                      {new Date(appt.dateTime).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--mf-text-2)" }}>{appt.type}{appt.notes ? ` · ${appt.notes}` : ""}</p>
                  </div>
                  <RealStatusPill status={appt.status as Status} />
                </div>
              ))
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Contact" bodyClassName="space-y-3">
            <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
              <span style={{ color: "var(--mf-text-3)" }}><Phone size={15} /></span> {patient.phone}
            </div>
            {patient.email && (
              <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                <span style={{ color: "var(--mf-text-3)" }}><Mail size={15} /></span> {patient.email}
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--mf-text-2)" }}>
                <span style={{ color: "var(--mf-text-3)" }}><MapPin size={15} /></span> {patient.address}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Summary" bodyClassName="space-y-2.5">
            <div className="flex justify-between text-[13px]"><span style={{ color: "var(--mf-text-2)" }}>Total visits</span><span className="font-semibold" style={{ color: "var(--mf-text)" }}>{patient.appointments.length}</span></div>
            <div className="flex justify-between text-[13px]"><span style={{ color: "var(--mf-text-2)" }}>Completed</span><span className="font-semibold" style={{ color: "var(--mf-text)" }}>{patient.appointments.filter((a) => a.status === "COMPLETED").length}</span></div>
            <div className="flex justify-between text-[13px]"><span style={{ color: "var(--mf-text-2)" }}>Cancelled</span><span className="font-semibold" style={{ color: "var(--mf-text)" }}>{patient.appointments.filter((a) => a.status === "CANCELLED").length}</span></div>
          </SectionCard>

          {patient.notes && (
            <SectionCard title="Notes">
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--mf-text-2)" }}>{patient.notes}</p>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
