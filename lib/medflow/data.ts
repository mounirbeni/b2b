/* MedFlow AI — mock data layer (design showcase, no backend). */

export type Status =
  | "waiting"
  | "in-consultation"
  | "completed"
  | "cancelled"
  | "scheduled"
  | "no-show";

export const STATUS_META: Record<
  Status,
  { label: string; fg: string; bg: string; dot: string }
> = {
  waiting: { label: "Waiting", fg: "var(--mf-warning)", bg: "var(--mf-warning-soft)", dot: "var(--mf-warning)" },
  "in-consultation": { label: "In Consultation", fg: "var(--mf-primary)", bg: "var(--mf-primary-soft)", dot: "var(--mf-primary)" },
  completed: { label: "Completed", fg: "var(--mf-success)", bg: "var(--mf-success-soft)", dot: "var(--mf-success)" },
  cancelled: { label: "Cancelled", fg: "var(--mf-error)", bg: "var(--mf-error-soft)", dot: "var(--mf-error)" },
  scheduled: { label: "Scheduled", fg: "var(--mf-info)", bg: "var(--mf-info-soft)", dot: "var(--mf-info)" },
  "no-show": { label: "No-show", fg: "var(--mf-text-2)", bg: "var(--mf-surface-hover)", dot: "var(--mf-text-3)" },
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  color: string;
  online: boolean;
  rating: number;
  patientsToday: number;
  utilization: number;
  room: string;
};

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Chen", specialty: "Cardiology", avatar: "SC", color: "#2563eb", online: true, rating: 4.9, patientsToday: 12, utilization: 86, room: "203" },
  { id: "d2", name: "Dr. Marcus Reed", specialty: "Neurology", avatar: "MR", color: "#8b5cf6", online: true, rating: 4.8, patientsToday: 9, utilization: 74, room: "118" },
  { id: "d3", name: "Dr. Amara Okafor", specialty: "Pediatrics", avatar: "AO", color: "#10b981", online: true, rating: 5.0, patientsToday: 15, utilization: 92, room: "204" },
  { id: "d4", name: "Dr. Liam Novak", specialty: "Orthopedics", avatar: "LN", color: "#f59e0b", online: false, rating: 4.7, patientsToday: 7, utilization: 61, room: "110" },
  { id: "d5", name: "Dr. Priya Nair", specialty: "Dermatology", avatar: "PN", color: "#ec4899", online: true, rating: 4.9, patientsToday: 11, utilization: 78, room: "220" },
  { id: "d6", name: "Dr. Omar Haddad", specialty: "General Medicine", avatar: "OH", color: "#0ea5e9", online: false, rating: 4.6, patientsToday: 6, utilization: 48, room: "101" },
];

export type Patient = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  lastVisit: string;
  doctor: string;
  status: Status;
  insurance: string;
  mrn: string;
  blood: string;
};

export const patients: Patient[] = [
  { id: "p1", name: "Elena Fisher", avatar: "EF", color: "#2563eb", phone: "+1 415 555 0132", age: 34, gender: "Female", lastVisit: "Jun 28, 2026", doctor: "Dr. Sarah Chen", status: "in-consultation", insurance: "BlueCross", mrn: "MRN-10432", blood: "O+" },
  { id: "p2", name: "James Sullivan", avatar: "JS", color: "#10b981", phone: "+1 415 555 0198", age: 52, gender: "Male", lastVisit: "Jun 30, 2026", doctor: "Dr. Marcus Reed", status: "waiting", insurance: "Aetna", mrn: "MRN-10433", blood: "A+" },
  { id: "p3", name: "Aisha Rahman", avatar: "AR", color: "#8b5cf6", phone: "+1 415 555 0110", age: 8, gender: "Female", lastVisit: "Jul 01, 2026", doctor: "Dr. Amara Okafor", status: "waiting", insurance: "Kaiser", mrn: "MRN-10434", blood: "B+" },
  { id: "p4", name: "Robert Klein", avatar: "RK", color: "#f59e0b", phone: "+1 415 555 0176", age: 45, gender: "Male", lastVisit: "Jun 20, 2026", doctor: "Dr. Liam Novak", status: "completed", insurance: "Cigna", mrn: "MRN-10435", blood: "AB-" },
  { id: "p5", name: "Maria Gonzalez", avatar: "MG", color: "#ec4899", phone: "+1 415 555 0143", age: 29, gender: "Female", lastVisit: "Jul 02, 2026", doctor: "Dr. Priya Nair", status: "scheduled", insurance: "United", mrn: "MRN-10436", blood: "O-" },
  { id: "p6", name: "David Park", avatar: "DP", color: "#0ea5e9", phone: "+1 415 555 0187", age: 61, gender: "Male", lastVisit: "Jun 15, 2026", doctor: "Dr. Omar Haddad", status: "completed", insurance: "Self-pay", mrn: "MRN-10437", blood: "A-" },
  { id: "p7", name: "Sofia Rossi", avatar: "SR", color: "#14b8a6", phone: "+1 415 555 0121", age: 41, gender: "Female", lastVisit: "Jun 29, 2026", doctor: "Dr. Sarah Chen", status: "cancelled", insurance: "BlueCross", mrn: "MRN-10438", blood: "B-" },
  { id: "p8", name: "Noah Bennett", avatar: "NB", color: "#f43f5e", phone: "+1 415 555 0165", age: 3, gender: "Male", lastVisit: "Jul 01, 2026", doctor: "Dr. Amara Okafor", status: "no-show", insurance: "Kaiser", mrn: "MRN-10439", blood: "O+" },
];

export type Appointment = {
  id: string;
  patient: string;
  patientAvatar: string;
  patientColor: string;
  doctor: string;
  department: string;
  room: string;
  type: string;
  status: Status;
  start: string; // "09:30"
  durationMin: number;
  day: number; // 0-6 for week grid
};

export const appointments: Appointment[] = [
  { id: "a1", patient: "Elena Fisher", patientAvatar: "EF", patientColor: "#2563eb", doctor: "Dr. Sarah Chen", department: "Cardiology", room: "203", type: "Follow-up", status: "in-consultation", start: "09:00", durationMin: 30, day: 3 },
  { id: "a2", patient: "James Sullivan", patientAvatar: "JS", patientColor: "#10b981", doctor: "Dr. Marcus Reed", department: "Neurology", room: "118", type: "Consultation", status: "waiting", start: "09:30", durationMin: 45, day: 3 },
  { id: "a3", patient: "Aisha Rahman", patientAvatar: "AR", patientColor: "#8b5cf6", doctor: "Dr. Amara Okafor", department: "Pediatrics", room: "204", type: "Vaccination", status: "waiting", start: "10:00", durationMin: 20, day: 3 },
  { id: "a4", patient: "Maria Gonzalez", patientAvatar: "MG", patientColor: "#ec4899", doctor: "Dr. Priya Nair", department: "Dermatology", room: "220", type: "Screening", status: "scheduled", start: "10:30", durationMin: 30, day: 3 },
  { id: "a5", patient: "Robert Klein", patientAvatar: "RK", patientColor: "#f59e0b", doctor: "Dr. Liam Novak", department: "Orthopedics", room: "110", type: "Post-op", status: "scheduled", start: "11:15", durationMin: 30, day: 3 },
  { id: "a6", patient: "David Park", patientAvatar: "DP", patientColor: "#0ea5e9", doctor: "Dr. Omar Haddad", department: "General", room: "101", type: "Check-up", status: "completed", start: "08:30", durationMin: 30, day: 3 },
  { id: "a7", patient: "Sofia Rossi", patientAvatar: "SR", patientColor: "#14b8a6", doctor: "Dr. Sarah Chen", department: "Cardiology", room: "203", type: "ECG", status: "scheduled", start: "13:00", durationMin: 45, day: 3 },
  { id: "a8", patient: "Noah Bennett", patientAvatar: "NB", patientColor: "#f43f5e", doctor: "Dr. Amara Okafor", department: "Pediatrics", room: "204", type: "Wellness", status: "scheduled", start: "14:00", durationMin: 20, day: 3 },
];

export type Activity = {
  id: string;
  icon: string;
  text: string;
  meta: string;
  time: string;
  tone: "primary" | "success" | "warning" | "error" | "info";
};

export const activities: Activity[] = [
  { id: "ac1", icon: "check", text: "Consultation completed for", meta: "David Park", time: "2m ago", tone: "success" },
  { id: "ac2", icon: "user", text: "New patient registered", meta: "Maria Gonzalez", time: "14m ago", tone: "primary" },
  { id: "ac3", icon: "flask", text: "Lab results ready for", meta: "James Sullivan", time: "31m ago", tone: "info" },
  { id: "ac4", icon: "card", text: "Payment received", meta: "$340.00 · Invoice #4821", time: "48m ago", tone: "success" },
  { id: "ac5", icon: "x", text: "Appointment cancelled by", meta: "Sofia Rossi", time: "1h ago", tone: "error" },
  { id: "ac6", icon: "pill", text: "Prescription issued for", meta: "Elena Fisher", time: "1h ago", tone: "primary" },
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: "primary" | "success" | "warning" | "error" | "info";
  unread: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", title: "Patient checked in", body: "James Sullivan is now in the waiting room.", time: "just now", tone: "info", unread: true },
  { id: "n2", title: "Lab report ready", body: "CBC panel for James Sullivan is available.", time: "12m ago", tone: "success", unread: true },
  { id: "n3", title: "Appointment cancelled", body: "Sofia Rossi cancelled her 3:00 PM slot.", time: "1h ago", tone: "error", unread: true },
  { id: "n4", title: "Payment received", body: "$340.00 from Invoice #4821 was settled.", time: "2h ago", tone: "success", unread: false },
  { id: "n5", title: "Low stock alert", body: "Amoxicillin 500mg is below reorder point.", time: "3h ago", tone: "warning", unread: false },
];

/* KPI dashboard tiles */
export const kpis = [
  { key: "appts", label: "Today's Appointments", value: "38", delta: 12.5, spark: [18, 22, 20, 28, 25, 32, 30, 34, 38], tone: "primary", icon: "calendar" },
  { key: "waiting", label: "Patients Waiting", value: "6", delta: -8.0, spark: [9, 8, 10, 7, 8, 6, 7, 6, 6], tone: "warning", icon: "clock" },
  { key: "consult", label: "In Consultation", value: "4", delta: 5.0, spark: [2, 3, 3, 4, 3, 4, 5, 4, 4], tone: "info", icon: "stethoscope" },
  { key: "completed", label: "Completed Visits", value: "24", delta: 18.2, spark: [10, 12, 14, 16, 18, 20, 21, 23, 24], tone: "success", icon: "check" },
  { key: "revToday", label: "Revenue Today", value: "$8,240", delta: 9.4, spark: [4, 5, 5.5, 6, 6.4, 7, 7.5, 8, 8.24], tone: "success", icon: "dollar" },
  { key: "revMonth", label: "Revenue This Month", value: "$186,540", delta: 22.1, spark: [120, 132, 140, 150, 158, 168, 175, 182, 186], tone: "primary", icon: "trend" },
  { key: "cancelled", label: "Cancelled Today", value: "3", delta: -25.0, spark: [6, 5, 5, 4, 4, 3, 4, 3, 3], tone: "error", icon: "x" },
  { key: "wait", label: "Avg. Waiting Time", value: "12m", delta: -14.0, spark: [20, 18, 17, 16, 15, 14, 13, 12, 12], tone: "info", icon: "hourglass" },
];

/* Chart data */
export const revenueSeries = [
  { label: "Jan", a: 128, b: 96 },
  { label: "Feb", a: 142, b: 108 },
  { label: "Mar", a: 138, b: 112 },
  { label: "Apr", a: 156, b: 124 },
  { label: "May", a: 168, b: 132 },
  { label: "Jun", a: 186, b: 148 },
];

export const apptTrend = [
  { label: "Mon", v: 42 },
  { label: "Tue", v: 55 },
  { label: "Wed", v: 48 },
  { label: "Thu", v: 61 },
  { label: "Fri", v: 58 },
  { label: "Sat", v: 34 },
  { label: "Sun", v: 12 },
];

export const patientGrowth = [
  { label: "W1", v: 40 },
  { label: "W2", v: 62 },
  { label: "W3", v: 71 },
  { label: "W4", v: 88 },
  { label: "W5", v: 96 },
  { label: "W6", v: 118 },
];

export const doctorShare = [
  { label: "Dr. Chen", v: 32, color: "var(--mf-c1)" },
  { label: "Dr. Okafor", v: 26, color: "var(--mf-c2)" },
  { label: "Dr. Reed", v: 18, color: "var(--mf-c3)" },
  { label: "Dr. Nair", v: 14, color: "var(--mf-c4)" },
  { label: "Others", v: 10, color: "var(--mf-c5)" },
];

/* Reception queue */
export const queue = [
  { id: "q1", name: "James Sullivan", avatar: "JS", color: "#10b981", doctor: "Dr. Reed", token: "A-12", wait: 8, status: "waiting" as Status, priority: "normal" },
  { id: "q2", name: "Aisha Rahman", avatar: "AR", color: "#8b5cf6", doctor: "Dr. Okafor", token: "A-13", wait: 5, status: "waiting" as Status, priority: "normal" },
  { id: "q3", name: "Frank Miller", avatar: "FM", color: "#ef4444", doctor: "Dr. Chen", token: "E-01", wait: 0, status: "waiting" as Status, priority: "emergency" },
  { id: "q4", name: "Elena Fisher", avatar: "EF", color: "#2563eb", doctor: "Dr. Chen", token: "A-11", wait: 0, status: "in-consultation" as Status, priority: "normal" },
];

/* Billing invoices */
export const invoices = [
  { id: "INV-4821", patient: "David Park", amount: 340, status: "Paid", method: "Card", date: "Jul 02", insurance: "Self-pay" },
  { id: "INV-4820", patient: "Elena Fisher", amount: 520, status: "Pending", method: "Insurance", date: "Jul 02", insurance: "BlueCross" },
  { id: "INV-4819", patient: "Robert Klein", amount: 1240, status: "Paid", method: "Card", date: "Jul 01", insurance: "Cigna" },
  { id: "INV-4818", patient: "Maria Gonzalez", amount: 180, status: "Overdue", method: "Cash", date: "Jun 28", insurance: "United" },
  { id: "INV-4817", patient: "Sofia Rossi", amount: 460, status: "Refunded", method: "Card", date: "Jun 27", insurance: "BlueCross" },
];

/* Inventory */
export const inventory = [
  { id: "i1", name: "Amoxicillin 500mg", category: "Medicine", stock: 42, reorder: 100, expiry: "2026-11", status: "low" },
  { id: "i2", name: "Surgical Gloves (M)", category: "Supplies", stock: 1240, reorder: 300, expiry: "2027-05", status: "ok" },
  { id: "i3", name: "Insulin Glargine", category: "Medicine", stock: 18, reorder: 40, expiry: "2026-08", status: "critical" },
  { id: "i4", name: "Digital Thermometer", category: "Equipment", stock: 56, reorder: 20, expiry: "—", status: "ok" },
  { id: "i5", name: "Paracetamol 1g", category: "Medicine", stock: 88, reorder: 120, expiry: "2026-07", status: "expiring" },
];

/* Lab requests */
export const labRequests = [
  { id: "LAB-2201", patient: "James Sullivan", test: "Complete Blood Count", doctor: "Dr. Reed", status: "Completed", priority: "Routine" },
  { id: "LAB-2202", patient: "Elena Fisher", test: "Lipid Panel", doctor: "Dr. Chen", status: "In Progress", priority: "Routine" },
  { id: "LAB-2203", patient: "Frank Miller", test: "Cardiac Troponin", doctor: "Dr. Chen", status: "Pending", priority: "STAT" },
  { id: "LAB-2204", patient: "Maria Gonzalez", test: "Thyroid (TSH)", doctor: "Dr. Nair", status: "Pending", priority: "Routine" },
];

/* Prescription medicines for autocomplete demo */
export const medicines = [
  "Amoxicillin 500mg", "Ibuprofen 400mg", "Metformin 850mg", "Atorvastatin 20mg",
  "Lisinopril 10mg", "Omeprazole 20mg", "Amlodipine 5mg", "Sertraline 50mg",
  "Azithromycin 250mg", "Paracetamol 1g",
];

/* Global search index */
export const searchIndex = [
  ...patients.map((p) => ({ type: "Patient", label: p.name, sub: `${p.mrn} · ${p.phone}`, href: "/medflow/patients" })),
  ...doctors.map((d) => ({ type: "Doctor", label: d.name, sub: d.specialty, href: "/medflow/doctors" })),
  ...invoices.map((i) => ({ type: "Invoice", label: i.id, sub: `${i.patient} · $${i.amount}`, href: "/medflow/billing" })),
  { type: "Page", label: "Reception Dashboard", sub: "Queue & walk-ins", href: "/medflow/reception" },
  { type: "Page", label: "Consultation Workspace", sub: "Clinical notes & orders", href: "/medflow/consultations" },
  { type: "Page", label: "Reports & Analytics", sub: "Revenue, performance", href: "/medflow/reports" },
];
