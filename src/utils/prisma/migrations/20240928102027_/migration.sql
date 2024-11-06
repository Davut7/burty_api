/*
  Warnings:

  - You are about to drop the column `visit_time ` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "visit_time ",
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL;
