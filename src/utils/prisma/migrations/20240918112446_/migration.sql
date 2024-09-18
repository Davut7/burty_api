/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `provider` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('MENTOR', 'USER');

-- CreateEnum
CREATE TYPE "auth_providers" AS ENUM ('google', 'email', 'facebook');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" "auth_providers" NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "user_role";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
