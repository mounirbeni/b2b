"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateDisplay } from "@/lib/date-utils";
import type { PatientWithStats } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PatientList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading } = useSWR<{ data: PatientWithStats[]; total: number; pageSize: number }>(
    `/api/patients?search=${encodeURIComponent(debouncedSearch)}&page=${page}`,
    fetcher
  );

  const patients = data?.data ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="البحث بالاسم أو الهاتف..."
          className="pr-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>آخر زيارة</TableHead>
              <TableHead>عدد الزيارات</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  لا يوجد مرضى
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell dir="ltr">{p.phone}</TableCell>
                  <TableCell>{p.lastVisit ? formatDateDisplay(p.lastVisit) : "-"}</TableCell>
                  <TableCell>{p.totalVisits ?? 0}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/patients/${p.id}`}>عرض</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            السابق
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            التالي
          </Button>
        </div>
      )}
    </div>
  );
}
