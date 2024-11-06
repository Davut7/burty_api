/*
  Warnings:

  - A unique constraint covering the columns `[space_id]` on the table `medias` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "space_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "medias_space_id_key" ON "medias"("space_id");

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
