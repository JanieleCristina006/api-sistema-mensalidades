/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Plano` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plano_nome_key" ON "Plano"("nome");
