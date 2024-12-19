/*
  Warnings:

  - You are about to drop the column `user_id` on the `comments` table. All the data in the column will be lost.
  - Added the required column `mentor_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "user_id",
ADD COLUMN     "mentor_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
