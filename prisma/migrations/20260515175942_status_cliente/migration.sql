-- CreateEnum
CREATE TYPE "ClienteStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "status" "ClienteStatus" NOT NULL DEFAULT 'ACTIVE';
