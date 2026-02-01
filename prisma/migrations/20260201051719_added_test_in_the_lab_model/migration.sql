-- AlterTable
ALTER TABLE "labs" ADD COLUMN     "testTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];
