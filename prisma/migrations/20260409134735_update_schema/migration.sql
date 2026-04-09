/*
  Warnings:

  - You are about to drop the column `data_pagamento` on the `Pagamento` table. All the data in the column will be lost.
  - The `status` column on the `Pagamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Assinaturas` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[telefone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `preco` on the `Plano` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SignatureStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAGO', 'PENDENTE', 'FALHOU', 'ESTORNADO');

-- DropForeignKey
ALTER TABLE "Assinaturas" DROP CONSTRAINT "Assinaturas_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Assinaturas" DROP CONSTRAINT "Assinaturas_plano_id_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_assinatura_id_fkey";

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "data_pagamento",
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "Plano" DROP COLUMN "preco",
ADD COLUMN     "preco" DECIMAL(10,2) NOT NULL;

-- DropTable
DROP TABLE "Assinaturas";

-- CreateTable
CREATE TABLE "Assinatura" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "plano_id" INTEGER NOT NULL,
    "status" "SignatureStatus" NOT NULL DEFAULT 'ACTIVE',
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_ultimo_pagamento" TIMESTAMP(3),
    "proximo_vencimento" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_telefone_key" ON "Client"("telefone");

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "Assinatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
