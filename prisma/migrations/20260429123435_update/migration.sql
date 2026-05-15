-- AlterEnum
ALTER TYPE "SignatureStatus" ADD VALUE 'PENDING';

COMMIT;
-- AlterTable
ALTER TABLE "Assinatura" ALTER COLUMN "status" SET DEFAULT 'PENDING';
