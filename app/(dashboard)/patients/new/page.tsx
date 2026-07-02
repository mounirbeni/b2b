import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientForm } from "@/components/patients/patient-form";

export default function NewPatientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">إضافة مريض جديد</h1>
      <Card>
        <CardHeader>
          <CardTitle>بيانات المريض</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm />
        </CardContent>
      </Card>
    </div>
  );
}
