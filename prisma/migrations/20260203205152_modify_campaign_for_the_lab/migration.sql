-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CampaignType" ADD VALUE 'HEALTH_CHECKUP_CAMP';
ALTER TYPE "CampaignType" ADD VALUE 'DISCOUNTED_TESTS';
ALTER TYPE "CampaignType" ADD VALUE 'HOME_COLLECTION_DRIVE';
ALTER TYPE "CampaignType" ADD VALUE 'COMMUNITY_SCREENING';

-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "health_concern" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "is_free_home_sample_collection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "labId" TEXT,
ADD COLUMN     "report_time" TEXT,
ADD COLUMN     "test_category" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tests_included" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "doctorId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "campaigns_labId_idx" ON "campaigns"("labId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
