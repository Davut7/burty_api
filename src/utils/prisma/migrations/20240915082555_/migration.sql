/*
  Warnings:

  - You are about to drop the column `file_type` on the `medias` table. All the data in the column will be lost.
  - Added the required column `media_type` to the `medias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medias" DROP COLUMN "file_type",
ADD COLUMN     "media_type" "media_type" NOT NULL;
