import type { Page } from "@playwright/test";

/** Unique-ish 6-digit suffix so specs can be re-run against a persistent test DB without collisions. */
export function uniqueSuffix() {
  return Date.now().toString().slice(-6);
}

/** A syntactically valid, unique Moroccan mobile number for test fixtures. `tag` avoids collisions within a single test. */
export function testPhone(suffix: string, tag: number) {
  return `+2126${String(tag).padStart(2, "0")}${suffix}`;
}

export async function registerClinic(
  page: Page,
  opts: { clinicName: string; specialty: string; city: string; name: string; email: string; phone: string }
) {
  await page.goto("/register");
  await page.fill("#clinicName", opts.clinicName);
  await page.click("#specialty");
  await page.getByRole("option", { name: opts.specialty }).click();
  await page.click("#city");
  await page.getByRole("option", { name: opts.city, exact: true }).click();
  await page.fill("#name", opts.name);
  await page.fill("#email", opts.email);
  await page.fill("#phone", opts.phone);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');
}

export async function loginAsClinic(page: Page, email: string) {
  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');
}

export async function registerPatient(
  page: Page,
  opts: { name: string; phone: string }
) {
  await page.goto("/patient/register");
  await page.fill("#name", opts.name);
  await page.fill("#phone", opts.phone);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');
}

export async function loginAsPatient(page: Page, phone: string) {
  await page.goto("/patient/login");
  await page.fill("#identifier", phone);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');
}
