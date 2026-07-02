import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientCard } from "@/components/patients/patient-card";
import { StatusBadge } from "@/components/appointments/status-badge";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/date-utils";
import type { Status } from "@/types";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const patient = await prisma.patient.findFirst({
    where: { id: params.id, userId: session!.user.id },
    include: { appointments: { orderBy: { dateTime: "desc" } } },
  });

  if (!patient) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ملف المريض</h1>
        <Button asChild>
          <Link href={`/appointments?patientId=${patient.id}`}>
            <CalendarPlus className="h-4 w-4" /> حجز موعد
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <PatientCard patient={patient} />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>سجل المواعيد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {patient.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد مواعيد سابقة</p>
              ) : (
                patient.appointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {formatDateDisplay(appt.dateTime)} - {formatTimeDisplay(appt.dateTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">{appt.notes}</p>
                    </div>
                    <StatusBadge status={appt.status as Status} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
