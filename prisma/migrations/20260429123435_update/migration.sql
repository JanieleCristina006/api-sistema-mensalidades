-- AlterEnum
ALTER TYPE "SignatureStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Assinatura" ALTER COLUMN "status" SET DEFAULT 'PENDING';
