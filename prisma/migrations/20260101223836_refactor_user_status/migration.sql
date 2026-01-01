/*
  Warnings:

  - You are about to drop the column `status` on the `doctors` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED', 'ARCHIVED');

-- Step 1: Add new status column
ALTER TABLE "users" ADD COLUMN "new_status" "UserStatus" DEFAULT 'ACTIVE';

-- Step 2: Migrate existing Boolean status (True -> ACTIVE, False -> BLOCKED)
UPDATE "users"
SET "new_status" = CASE 
    WHEN "status" = true THEN 'ACTIVE'::"UserStatus"
    WHEN "status" = false THEN 'BLOCKED'::"UserStatus"
    ELSE 'ACTIVE'::"UserStatus" 
END;

-- Step 3: Migrate Doctor status to User status
-- Map DoctorStatus (PENDING, APPROVED, REJECTED) to UserStatus
UPDATE "users"
SET "new_status" = CASE 
    WHEN d."status" = 'PENDING' THEN 'PENDING'::"UserStatus"
    WHEN d."status" = 'APPROVED' THEN 'ACTIVE'::"UserStatus"
    WHEN d."status" = 'REJECTED' THEN 'BLOCKED'::"UserStatus" 
    ELSE "users"."new_status"
END
FROM "doctors" d
WHERE "users"."id" = d."userId";

-- Step 4: Drop old columns and rename new column
ALTER TABLE "doctors" DROP COLUMN "status";

ALTER TABLE "users" DROP COLUMN "status";
ALTER TABLE "users" RENAME COLUMN "new_status" TO "status";

-- Ensure constraints (NOT NULL and DEFAULT)
ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "DoctorStatus";
