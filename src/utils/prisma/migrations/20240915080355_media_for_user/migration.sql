/*
  Warnings:

  - You are about to drop the column `client_id` on the `medias` table. All the data in the column will be lost.
  - You are about to drop the column `education_id` on the `medias` table. All the data in the column will be lost.
  - You are about to drop the column `specialist_id` on the `medias` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `medias` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "medias_client_id_key";

-- DropIndex
DROP INDEX "medias_education_id_key";

-- AlterTable
ALTER TABLE "medias" DROP COLUMN "client_id",
DROP COLUMN "education_id",
DROP COLUMN "specialist_id",
ADD COLUMN     "user_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "medias_user_id_key" ON "medias"("user_id");

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
