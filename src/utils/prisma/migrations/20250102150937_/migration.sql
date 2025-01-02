-- CreateTable
CREATE TABLE "booking_participiants" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "booking_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "booking_participiants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_participiants" ADD CONSTRAINT "booking_participiants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_participiants" ADD CONSTRAINT "booking_participiants_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
