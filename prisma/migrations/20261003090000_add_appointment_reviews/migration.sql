-- Link doctor reviews to the appointment that made the review eligible.
ALTER TABLE "reviews" ADD COLUMN "appointmentId" TEXT;

CREATE UNIQUE INDEX "reviews_appointmentId_key" ON "reviews"("appointmentId");
CREATE INDEX "reviews_doctorId_idx" ON "reviews"("doctorId");
CREATE INDEX "reviews_patientId_idx" ON "reviews"("patientId");

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_appointmentId_fkey"
FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
