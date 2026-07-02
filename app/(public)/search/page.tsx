import Link from "next/link";
import { MapPin, Search as SearchIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { PUBLISHED_CLINIC_WHERE } from "@/lib/clinic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOROCCAN_CITIES, SPECIALTIES, SPECIALTY_LABELS, type Specialty } from "@/types";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

interface SearchPageProps {
  searchParams: { city?: string; specialty?: string; q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const city = searchParams.city ?? "";
  const specialty = searchParams.specialty ?? "";
  const q = searchParams.q?.trim() ?? "";

  const clinics = await prisma.clinic.findMany({
    where: {
      ...PUBLISHED_CLINIC_WHERE,
      ...(city && { city }),
      ...(specialty && { specialty }),
      ...(q && { name: { contains: q } }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ابحث عن عيادة</h1>
        <p className="text-sm text-muted-foreground">اختر المدينة والتخصص للعثور على عيادة قريبة منك</p>
      </div>

      <form className="grid grid-cols-1 gap-3 sm:grid-cols-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="ابحث باسم العيادة..."
          className={`${selectClassName} sm:col-span-2`}
        />
        <select name="city" defaultValue={city} className={selectClassName}>
          <option value="">كل المدن</option>
          {MOROCCAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="specialty" defaultValue={specialty} className={selectClassName}>
          <option value="">كل التخصصات</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {SPECIALTY_LABELS[s]}
            </option>
          ))}
        </select>
        <Button type="submit" className="sm:col-span-4">
          <SearchIcon className="h-4 w-4" /> بحث
        </Button>
      </form>

      {clinics.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            لا توجد عيادات مطابقة لبحثك حالياً
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <Link key={clinic.id} href={`/clinics/${clinic.slug}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardContent className="space-y-2 p-4">
                  <h2 className="font-semibold">{clinic.name}</h2>
                  <p className="text-sm text-primary">
                    {SPECIALTY_LABELS[clinic.specialty as Specialty] ?? clinic.specialty}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {clinic.city}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
