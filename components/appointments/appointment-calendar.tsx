"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

interface AppointmentCalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

export function AppointmentCalendar({ selected, onSelect }: AppointmentCalendarProps) {
  return (
    <Card>
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && onSelect(date)}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
