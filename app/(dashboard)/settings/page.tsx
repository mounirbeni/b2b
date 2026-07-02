import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { clinic: true },
  });

  if (!user || !user.clinic) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">إعدادات العيادة</h1>
      <Card>
        <CardHeader>
          <CardTitle>معلومات العيادة</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm user={user} clinic={user.clinic} />
        </CardContent>
      </Card>
    </div>
  );
}
