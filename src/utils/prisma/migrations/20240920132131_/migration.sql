/*
  Warnings:

  - You are about to drop the column `user_name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT;
