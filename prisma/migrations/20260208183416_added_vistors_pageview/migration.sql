-- AlterTable
ALTER TABLE "analytics_events" ADD COLUMN     "visitorId" TEXT;

-- AlterTable
ALTER TABLE "page_views" ADD COLUMN     "visitorId" TEXT;

-- CreateIndex
CREATE INDEX "analytics_events_visitorId_idx" ON "analytics_events"("visitorId");

-- CreateIndex
CREATE INDEX "page_views_visitorId_idx" ON "page_views"("visitorId");
