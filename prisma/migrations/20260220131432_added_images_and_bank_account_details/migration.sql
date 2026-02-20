-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "accountHolderName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "clinicImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ifscCode" TEXT;
