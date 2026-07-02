import { redirect } from "next/navigation";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  redirect(`/medflow/patients/${params.id}`);
}
