-- AlterTable
ALTER TABLE "analytics_events" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "page_views" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "metadata" JSONB;
