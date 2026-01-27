-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('OPD', 'HEALTH_CAMP', 'FREE_CHECKUP');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'IN_REVIEW', 'PAUSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "description" TEXT,
    "campaign_type" "CampaignType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "discount_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "location" JSONB NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "schedule" JSONB NOT NULL,
    "booking_rules" JSONB NOT NULL,
    "eligibility" JSONB NOT NULL,
    "stats" JSONB,
    "media" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_doctorId_idx" ON "campaigns"("doctorId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
