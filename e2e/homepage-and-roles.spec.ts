import { test, expect } from "@playwright/test";
import { registerClinic, registerPatient, testPhone, uniqueSuffix } from "./helpers";

test("anonymous visitor sees the public homepage, not a login redirect", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("ابحث واحجز موعدك الطبي")).toBeVisible();
  await expect(page).toHaveURL("/");
});

test("homepage CTAs route to the right places", async ({ page }) => {
  await page.goto("/");
  await page.click('a:has-text("ابحث عن عيادة")');
  await expect(page).toHaveURL(/\/search$/);
});

test("clinic session is bounced away from patient area and vice versa", async ({ page, context }) => {
  const suffix = uniqueSuffix();

  await registerClinic(page, {
    clinicName: `عيادة الاختبار ${suffix}`,
    specialty: "طب عام",
    city: "الرباط",
    name: "د. اختبار",
    email: `clinic-${suffix}@e2e.test`,
    phone: testPhone(suffix, 1),
  });
  await page.waitForURL("**/medflow/dashboard", { timeout: 15000 });

  // Header reflects the logged-in clinic session.
  await page.goto("/");
  await expect(page.getByText("لوحة تحكم العيادة")).toBeVisible();

  // Clinic session cannot reach the patient area — redirected to its own dashboard,
  // not dumped on the patient login form (which would just bounce it again).
  await page.goto("/patient/appointments");
  await expect(page).toHaveURL(/\/dashboard$/);

  await context.clearCookies();

  await registerPatient(page, { name: `مريض ${suffix}`, phone: testPhone(suffix, 2) });
  await page.waitForURL("/patient/appointments", { timeout: 15000 });

  // Header reflects the logged-in patient session.
  await page.goto("/");
  await expect(page.getByText("حجوزاتي")).toBeVisible();

  // Patient session cannot reach the clinic dashboard — redirected to its own area.
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/patient\/appointments$/);

  // But the public homepage stays reachable regardless of role.
  await page.goto("/");
  await expect(page).toHaveURL("/");
});

test("existing clinic feature (/patients) is not shadowed by the /patient prefix", async ({ page }) => {
  const suffix = uniqueSuffix();
  await registerClinic(page, {
    clinicName: `عيادة ${suffix}`,
    specialty: "طب عام",
    city: "فاس",
    name: "د. تجربة",
    email: `clinic-patients-${suffix}@e2e.test`,
    phone: testPhone(suffix, 3),
  });
  await page.waitForURL("**/medflow/dashboard", { timeout: 15000 });

  await page.goto("/patients");
  await expect(page).toHaveURL(/\/medflow\/patients$/);
  await expect(page.getByRole("heading", { name: "Patients" })).toBeVisible();
});
