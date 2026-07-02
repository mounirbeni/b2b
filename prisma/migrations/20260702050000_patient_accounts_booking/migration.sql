-- CreateTable
CREATE TABLE "PatientAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientAccount_phone_key" ON "PatientAccount"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAccount_email_key" ON "PatientAccount"("email");

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "patientAccountId" TEXT;

-- CreateIndex
CREATE INDEX "Appointment_patientAccountId_idx" ON "Appointment"("patientAccountId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientAccountId_fkey" FOREIGN KEY ("patientAccountId") REFERENCES "PatientAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Prevent double-booking the same clinic slot; cancelled appointments free up the slot again.
CREATE UNIQUE INDEX "Appointment_clinic_slot_unique" ON "Appointment"("clinicId", "dateTime") WHERE "status" != 'CANCELLED';
