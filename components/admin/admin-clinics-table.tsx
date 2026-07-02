"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Prisma } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CLINIC_STATUS_COLORS,
  CLINIC_STATUS_LABELS,
  CLINIC_STATUSES,
  SPECIALTY_LABELS,
  SUBSCRIPTION_PLAN_LABELS,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUSES,
  type ClinicStatus,
  type Specialty,
} from "@/types";
import { updateClinicStatusAction, updateSubscriptionAction } from "@/app/(admin)/admin/actions";

type ClinicWithRelations = Prisma.ClinicGetPayload<{ include: { subscription: true; owner: true } }>;

const selectClassName =
  "h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function AdminClinicsTable({ clinics }: { clinics: ClinicWithRelations[] }) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>العيادة</TableHead>
            <TableHead>المالك</TableHead>
            <TableHead>التخصص</TableHead>
            <TableHead>المدينة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الاشتراك</TableHead>
            <TableHead>إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                لا توجد عيادات
              </TableCell>
            </TableRow>
          ) : (
            clinics.map((clinic) => <ClinicRow key={clinic.id} clinic={clinic} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ClinicRow({ clinic }: { clinic: ClinicWithRelations }) {
  const [status, setStatus] = useState(clinic.status);
  const [plan, setPlan] = useState(clinic.subscription?.plan ?? "TRIAL");
  const [subStatus, setSubStatus] = useState(clinic.subscription?.status ?? "TRIALING");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingSub, setSavingSub] = useState(false);

  async function handleStatusChange(next: string) {
    setSavingStatus(true);
    const result = await updateClinicStatusAction(clinic.id, next);
    setSavingStatus(false);
    if (!result.success) {
      toast.error(result.error ?? "فشل التحديث");
      return;
    }
    setStatus(next);
    toast.success("تم تحديث حالة العيادة");
  }

  async function handleSubscriptionSave() {
    setSavingSub(true);
    const result = await updateSubscriptionAction(clinic.id, plan, subStatus);
    setSavingSub(false);
    if (!result.success) {
      toast.error(result.error ?? "فشل التحديث");
      return;
    }
    toast.success("تم تحديث الاشتراك");
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{clinic.name}</TableCell>
      <TableCell className="text-xs text-muted-foreground" dir="ltr">
        {clinic.owner.email}
      </TableCell>
      <TableCell className="text-xs">
        {clinic.specialty ? (SPECIALTY_LABELS[clinic.specialty as Specialty] ?? clinic.specialty) : "—"}
      </TableCell>
      <TableCell className="text-xs">{clinic.city ?? "—"}</TableCell>
      <TableCell>
        <Badge variant="outline" className={CLINIC_STATUS_COLORS[status as ClinicStatus]}>
          {CLINIC_STATUS_LABELS[status as ClinicStatus] ?? status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <select
            className={selectClassName}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            {SUBSCRIPTION_PLANS.map((p) => (
              <option key={p} value={p}>
                {SUBSCRIPTION_PLAN_LABELS[p]}
              </option>
            ))}
          </select>
          <select
            className={selectClassName}
            value={subStatus}
            onChange={(e) => setSubStatus(e.target.value)}
          >
            {SUBSCRIPTION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {SUBSCRIPTION_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" disabled={savingSub} onClick={handleSubscriptionSave}>
            حفظ
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {CLINIC_STATUSES.filter((s) => s !== status).map((s) => (
            <Button
              key={s}
              size="sm"
              variant="outline"
              disabled={savingStatus}
              onClick={() => handleStatusChange(s)}
            >
              {CLINIC_STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}
