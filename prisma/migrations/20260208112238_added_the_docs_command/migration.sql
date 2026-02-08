-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "profilePic" TEXT;

-- CreateTable
CREATE TABLE "patient_docs" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "fileUrl" TEXT NOT NULL,
    "sizeMb" DOUBLE PRECISION,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appointmentId" TEXT,
    "labId" TEXT,
    "doctorId" TEXT,

    CONSTRAINT "patient_docs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "patient_docs" ADD CONSTRAINT "patient_docs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_docs" ADD CONSTRAINT "patient_docs_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_docs" ADD CONSTRAINT "patient_docs_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_docs" ADD CONSTRAINT "patient_docs_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
