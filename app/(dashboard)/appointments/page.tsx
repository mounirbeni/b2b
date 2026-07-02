"use client";

import { useState } from "react";

import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { AppointmentList } from "@/components/appointments/appointment-list";

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">المواعيد</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <AppointmentCalendar selected={selectedDate} onSelect={setSelectedDate} />
        </div>
        <div className="md:col-span-2">
          <AppointmentList date={selectedDate} />
        </div>
      </div>
    </div>
  );
}
