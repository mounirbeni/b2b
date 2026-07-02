import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { AdminClinicsTable } from "@/components/admin/admin-clinics-table";

export default async function AdminPage() {
  const [clinics, totalPatients, totalAppointments, pendingCount] = await Promise.all([
    prisma.clinic.findMany({
      include: { subscription: true, owner: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.clinic.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">نظرة عامة</h1>
        <p className="text-sm text-muted-foreground">إدارة العيادات والاشتراكات على المنصة</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="إجمالي العيادات" value={clinics.length} />
        <StatCard label="بانتظار المراجعة" value={pendingCount} />
        <StatCard label="إجمالي المرضى" value={totalPatients} />
        <StatCard label="إجمالي المواعيد" value={totalAppointments} />
      </div>

      <AdminClinicsTable clinics={clinics} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
