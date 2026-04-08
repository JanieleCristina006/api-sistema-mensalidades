-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Assinaturas" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "plano_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_ultimo_pagamento" TIMESTAMP(3),
    "proximo_vencimento" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pagamento" (
    "id" SERIAL NOT NULL,
    "assinatura_id" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL,
    "metodo" TEXT NOT NULL,
    "obs" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "public"."Client"("cpf" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "public"."Client"("email" ASC);

-- AddForeignKey
ALTER TABLE "public"."Assinaturas" ADD CONSTRAINT "Assinaturas_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assinaturas" ADD CONSTRAINT "Assinaturas_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "public"."Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pagamento" ADD CONSTRAINT "Pagamento_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "public"."Assinaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
