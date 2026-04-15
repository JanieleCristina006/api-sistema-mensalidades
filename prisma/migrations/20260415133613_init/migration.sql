/*
  Warnings:

  - A unique constraint covering the columns `[assinatura_id,referencia_mes,referencia_ano]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referencia_ano` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referencia_mes` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "referencia_ano" INTEGER NOT NULL,
ADD COLUMN     "referencia_mes" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_assinatura_id_referencia_mes_referencia_ano_key" ON "Pagamento"("assinatura_id", "referencia_mes", "referencia_ano");
