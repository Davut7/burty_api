/*
  Warnings:

  - Added the required column `status` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('pending', 'paid', 'cancelled');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "status" "booking_status" NOT NULL;
