import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/date-utils";
import { SPECIALTY_LABELS, STATUS_COLORS, STATUS_LABELS, type Specialty, type Status } from "@/types";

export default async function PatientAppointmentsPage() {
  const session = await auth();

  const bookings = await prisma.appointment.findMany({
    where: { patientAccountId: session!.user.id },
    include: { clinic: true },
    orderBy: { dateTime: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">حجوزاتي</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            لا توجد حجوزات بعد. ابحث عن عيادة لحجز موعدك الأول.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <p className="font-semibold">{booking.clinic.name}</p>
                  <p className="text-xs text-primary">
                    {SPECIALTY_LABELS[booking.clinic.specialty as Specialty] ?? booking.clinic.specialty}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateDisplay(booking.dateTime)} — {formatTimeDisplay(booking.dateTime)}
                  </p>
                </div>
                <Badge variant="outline" className={STATUS_COLORS[booking.status as Status]}>
                  {STATUS_LABELS[booking.status as Status]}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
