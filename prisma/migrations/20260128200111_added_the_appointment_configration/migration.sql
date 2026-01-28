-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "daily_limit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hourly_limit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "required_details" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "total_capacity" INTEGER;
