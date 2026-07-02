import Link from "next/link";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PatientList } from "@/components/patients/patient-list";

export default function PatientsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المرضى</h1>
        <Button asChild>
          <Link href="/patients/new">
            <UserPlus className="h-4 w-4" /> مريض جديد
          </Link>
        </Button>
      </div>
      <PatientList />
    </div>
  );
}
