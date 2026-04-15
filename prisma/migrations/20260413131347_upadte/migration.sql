/*
  Warnings:

  - The values [PAGO,PENDENTE,FALHOU,ESTORNADO] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `metodo` on the `Pagamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CREDIT_CARD');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PAID', 'PENDING', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."Pagamento" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Pagamento" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Pagamento" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
ALTER TYPE "SignatureStatus" ADD VALUE 'OVERDUE';

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "metodo",
ADD COLUMN     "metodo" "PaymentMethod" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
