-- AlterTable: Add doctor fields to campaigns table
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "doctor_name" TEXT;
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "doctor_image" TEXT;
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "doctor_experience" INTEGER;
ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "specialisation" TEXT;
