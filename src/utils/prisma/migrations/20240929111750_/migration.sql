/*
  Warnings:

  - A unique constraint covering the columns `[qr_code_id]` on the table `medias` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "qr_code_id" UUID;

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_booking_id_key" ON "qr_codes"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "medias_qr_code_id_key" ON "medias"("qr_code_id");

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
