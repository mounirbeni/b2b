-- AlterTable
ALTER TABLE "ReminderLog" ADD COLUMN "sid" TEXT,
ADD COLUMN "errorMessage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ReminderLog_sid_key" ON "ReminderLog"("sid");
