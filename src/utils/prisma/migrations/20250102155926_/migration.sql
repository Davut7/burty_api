/*
  Warnings:

  - Added the required column `email` to the `qr_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "qr_codes" ADD COLUMN     "email" TEXT NOT NULL;
