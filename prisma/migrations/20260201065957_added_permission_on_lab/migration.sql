-- AlterTable
ALTER TABLE "labs" ADD COLUMN     "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY['profile']::TEXT[],
ADD COLUMN     "profileCompletionPercentage" INTEGER NOT NULL DEFAULT 0;
