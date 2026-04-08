-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Plano" ADD COLUMN     "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE';
