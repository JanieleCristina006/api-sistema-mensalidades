/*
  Warnings:

  - Added the required column `avatar` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner` to the `Plano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Plano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "avatar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plano" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "descricao" TEXT NOT NULL;
