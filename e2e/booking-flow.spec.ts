import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { registerClinic, registerPatient, testPhone, uniqueSuffix } from "./helpers";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.$disconnect();
});

test("patient books a real slot, double-booking is rejected, clinic sees it", async ({ page, context }) => {
  const suffix = uniqueSuffix();
  const clinicEmail = `booking-clinic-${suffix}@e2e.test`;

  await registerClinic(page, {
    clinicName: `عيادة الحجز ${suffix}`,
    specialty: "طب الأسنان",
    city: "الرباط",
    name: "د. حجز",
    email: clinicEmail,
    phone: testPhone(suffix, 1),
  });
  await page.waitForURL("**/medflow/dashboard", { timeout: 15000 });

  // Approving a clinic is normally an admin-panel action (covered in admin.spec.ts) — here
  // we go straight to Prisma so this spec stays focused on the booking flow itself.
  const clinicToApprove = await prisma.clinic.findFirstOrThrow({ where: { owner: { email: clinicEmail } } });
  await prisma.clinic.update({ where: { id: clinicToApprove.id }, data: { status: "APPROVED" } });

  await context.clearCookies();
  await page.goto("/search");
  const clinicLink = page.locator(`a:has-text("عيادة الحجز ${suffix}")`);
  await expect(clinicLink).toBeVisible();
  const href = await clinicLink.getAttribute("href");
  expect(href).toBeTruthy();

  await registerPatient(page, { name: `مريض حجز ${suffix}`, phone: testPhone(suffix, 2) });
  await page.waitForURL("/patient/appointments", { timeout: 15000 });

  await page.goto(href!);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  await page.fill('input[type="date"]', tomorrow);

  const slotButtons = page.locator('button:has-text(":")');
  await expect(slotButtons.first()).toBeVisible({ timeout: 10000 });
  const firstSlotText = (await slotButtons.first().textContent())!.trim();

  await slotButtons.first().click();
  await page.waitForURL("/patient/appointments", { timeout: 10000 });
  await expect(page.getByText(`عيادة الحجز ${suffix}`)).toBeVisible();

  // The same slot must no longer be offered.
  await page.goto(href!);
  await page.fill('input[type="date"]', tomorrow);
  await expect(page.locator(`button:has-text("${firstSlotText}")`)).toHaveCount(0);

  // The clinic's own dashboard must see the patient-originated appointment.
  await context.clearCookies();
  await page.goto("/login");
  await page.fill("#email", clinicEmail);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/medflow/dashboard", { timeout: 15000 });

  const apiResult = await page.evaluate(
    async (dateStr) => (await fetch(`/api/appointments?date=${dateStr}`)).json(),
    tomorrow
  );
  expect(JSON.stringify(apiResult)).toContain(`مريض حجز ${suffix}`);
});

test("a PENDING (unapproved) clinic is not publicly bookable", async ({ page, context }) => {
  const suffix = uniqueSuffix();
  await registerClinic(page, {
    clinicName: `عيادة غير موافق عليها ${suffix}`,
    specialty: "طب عام",
    city: "طنجة",
    name: "د. انتظار",
    email: `pending-clinic-${suffix}@e2e.test`,
    phone: testPhone(suffix, 3),
  });
  await page.waitForURL("**/medflow/dashboard", { timeout: 15000 });
  await expect(page.getByText("قيد المراجعة")).toBeVisible();

  await context.clearCookies();
  await page.goto("/search");
  await expect(page.getByText(`عيادة غير موافق عليها ${suffix}`)).toHaveCount(0);
});
