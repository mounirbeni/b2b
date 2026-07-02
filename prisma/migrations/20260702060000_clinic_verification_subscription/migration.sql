-- AlterTable: new clinics default to PENDING (Postgres backfills this default onto existing rows too).
ALTER TABLE "Clinic" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING';

-- Grandfather in every clinic that already existed before verification was introduced,
-- so real clinics don't vanish from the public directory after this deploy.
UPDATE "Clinic" SET "status" = 'APPROVED';

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'TRIAL',
    "status" TEXT NOT NULL DEFAULT 'TRIALING',
    "trialEndsAt" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_clinicId_key" ON "Subscription"("clinicId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill an active subscription for every existing (grandfathered) clinic.
INSERT INTO "Subscription" ("id", "clinicId", "plan", "status", "createdAt", "updatedAt")
SELECT
    md5(random()::text || c."id" || clock_timestamp()::text),
    c."id",
    'BASIC',
    'ACTIVE',
    now(),
    now()
FROM "Clinic" c;
