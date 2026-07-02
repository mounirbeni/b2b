import { defineConfig } from "@playwright/test";

/**
 * Requires the app already running against a disposable Postgres database with
 * migrations applied (`npx prisma migrate deploy`), e.g.:
 *   DATABASE_URL=... AUTH_SECRET=... ADMIN_EMAILS=admin@platform.ma npx next dev -p 3100
 * Then: npx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // Single worker: against `next dev`, concurrent requests trigger concurrent per-route
  // JIT compilation, which is slow enough to flake UI assertions under load. Against a
  // production build (`next start`) this restriction can be lifted with --workers=N.
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH,
    },
  },
});
