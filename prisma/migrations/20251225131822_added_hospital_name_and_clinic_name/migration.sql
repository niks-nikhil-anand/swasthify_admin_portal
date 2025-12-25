/*
  Warnings:

  - You are about to drop the column `icon` on the `specializations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "clinicName" TEXT,
ADD COLUMN     "hospitalName" TEXT;

-- AlterTable
ALTER TABLE "specializations" DROP COLUMN "icon",
ADD COLUMN     "image" TEXT;
