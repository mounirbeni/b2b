import { test, expect } from "@playwright/test";
import { registerClinic, testPhone, uniqueSuffix } from "./helpers";

/**
 * Requires the dev/test server to be started with an ADMIN_EMAILS env var that includes
 * "e2e-admin@platform.ma", e.g.:
 *   ADMIN_EMAILS=e2e-admin@platform.ma npx next dev -p 3100
 */
const ADMIN_EMAIL = "e2e-admin@platform.ma";

test("admin approves a pending clinic and it becomes publicly bookable", async ({ page, context }) => {
  const suffix = uniqueSuffix();
  const clinicName = `عيادة موافقة الإدارة ${suffix}`;

  await registerClinic(page, {
    clinicName,
    specialty: "طب عام",
    city: "أكادير",
    name: "د. مراجعة",
    email: `admin-review-${suffix}@e2e.test`,
    phone: testPhone(suffix, 1),
  });
  await page.waitForURL("/dashboard", { timeout: 15000 });

  await context.clearCookies();
  await page.goto("/search");
  await expect(page.getByText(clinicName)).toHaveCount(0);

  // Log in as the admin. If ADMIN_EMAILS wasn't configured for this server, this account
  // registers as a normal (unused) clinic instead and this assertion will fail clearly.
  await registerClinic(page, {
    clinicName: "حساب إدارة (غير مستخدم)",
    specialty: "طب عام",
    city: "الرباط",
    name: "المشرف",
    email: ADMIN_EMAIL,
    phone: testPhone(suffix, 2),
  }).catch(() => {
    /* account may already exist from a previous run — fall through to login */
  });

  await context.clearCookies();
  await page.goto("/login");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin", {
    timeout: 15000,
  });

  const row = page.locator("tr", { hasText: clinicName });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "موافَق عليها" }).click();
  await expect(row.getByText("موافَق عليها")).toBeVisible();

  await context.clearCookies();
  await page.goto("/search");
  await expect(page.getByText(clinicName)).toBeVisible();
});

test("a clinic session is redirected away from /admin (to its own dashboard, not a login loop)", async ({
  page,
}) => {
  const suffix = uniqueSuffix();
  await registerClinic(page, {
    clinicName: `عيادة عادية ${suffix}`,
    specialty: "طب عام",
    city: "فاس",
    name: "د. عادي",
    email: `not-admin-${suffix}@e2e.test`,
    phone: testPhone(suffix, 3),
  });
  await page.waitForURL("/dashboard", { timeout: 15000 });

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("an anonymous visitor hitting /admin lands on /login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login$/);
});
