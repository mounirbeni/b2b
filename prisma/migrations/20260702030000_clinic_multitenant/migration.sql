-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "city" TEXT,
    "address" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- Backfill: one Clinic per existing User, carrying over clinicName/address.
INSERT INTO "Clinic" ("id", "ownerId", "slug", "name", "address", "createdAt", "updatedAt")
SELECT
    md5(random()::text || u."id" || clock_timestamp()::text),
    u."id",
    'clinic-' || substr(md5(random()::text || u."id"), 1, 10),
    COALESCE(u."clinicName", u."name", 'عيادة بدون اسم'),
    u."address",
    now(),
    now()
FROM "User" u;

-- AlterTable: add nullable clinicId columns first so existing rows can be backfilled.
ALTER TABLE "Patient" ADD COLUMN "clinicId" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "clinicId" TEXT;

UPDATE "Patient" p
SET "clinicId" = c."id"
FROM "Clinic" c
WHERE c."ownerId" = p."userId";

UPDATE "Appointment" a
SET "clinicId" = c."id"
FROM "Clinic" c
WHERE c."ownerId" = a."userId";

-- Drop the old User-based foreign keys before dropping the userId columns.
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

ALTER TABLE "Patient" DROP COLUMN "userId";
ALTER TABLE "Appointment" DROP COLUMN "userId";

ALTER TABLE "Patient" ALTER COLUMN "clinicId" SET NOT NULL;
ALTER TABLE "Appointment" ALTER COLUMN "clinicId" SET NOT NULL;

ALTER TABLE "User" DROP COLUMN "clinicName";
ALTER TABLE "User" DROP COLUMN "address";

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_ownerId_key" ON "Clinic"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_slug_key" ON "Clinic"("slug");

-- CreateIndex
CREATE INDEX "Patient_clinicId_idx" ON "Patient"("clinicId");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_dateTime_idx" ON "Appointment"("clinicId", "dateTime");

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
