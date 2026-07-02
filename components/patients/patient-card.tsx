import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateDisplay } from "@/lib/date-utils";
import type { Patient } from "@/types";

const GENDER_LABELS: Record<string, string> = { MALE: "ذكر", FEMALE: "أنثى" };

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{patient.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <InfoRow label="الهاتف" value={patient.phone} dir="ltr" />
        {patient.email && <InfoRow label="البريد الإلكتروني" value={patient.email} dir="ltr" />}
        {patient.birthDate && <InfoRow label="تاريخ الميلاد" value={formatDateDisplay(patient.birthDate)} />}
        {patient.gender && <InfoRow label="الجنس" value={GENDER_LABELS[patient.gender] ?? patient.gender} />}
        {patient.address && <InfoRow label="العنوان" value={patient.address} />}
        {patient.notes && <InfoRow label="ملاحظات" value={patient.notes} />}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return (
    <div className="flex items-center justify-between border-b pb-1 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span dir={dir}>{value}</span>
    </div>
  );
}
