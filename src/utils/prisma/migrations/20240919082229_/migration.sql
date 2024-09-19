-- CreateEnum
CREATE TYPE "PassType" AS ENUM ('single', 'duo', 'squad', 'team');

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "pass_type" "PassType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "visit_time " TEXT NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL,
    "players_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
