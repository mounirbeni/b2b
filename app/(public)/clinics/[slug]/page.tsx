import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SPECIALTY_LABELS, type Specialty } from "@/types";

export default async function ClinicProfilePage({ params }: { params: { slug: string } }) {
  const clinic = await prisma.clinic.findUnique({ where: { slug: params.slug } });

  if (!clinic || !clinic.specialty || !clinic.city) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            {SPECIALTY_LABELS[clinic.specialty as Specialty] ?? clinic.specialty}
          </Badge>
          <CardTitle className="text-2xl">{clinic.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {clinic.city}
            {clinic.address ? ` — ${clinic.address}` : ""}
          </p>
          {clinic.phone && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground" dir="ltr">
              <Phone className="h-4 w-4" /> {clinic.phone}
            </p>
          )}
          {clinic.description && <p className="text-sm">{clinic.description}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          الحجز الإلكتروني عبر المنصة متاح قريباً. تواصل مع العيادة مباشرة حالياً للحجز.
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/search" className="text-sm text-primary underline-offset-4 hover:underline">
          العودة لنتائج البحث
        </Link>
      </div>
    </div>
  );
}
