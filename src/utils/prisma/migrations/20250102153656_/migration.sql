-- CreateTable
CREATE TABLE "game_actions" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "game_action" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "game_statistics_id" UUID NOT NULL,

    CONSTRAINT "game_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatistics" (
    "id" TEXT NOT NULL,
    "booking_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "GameStatistics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "game_actions" ADD CONSTRAINT "game_actions_game_statistics_id_fkey" FOREIGN KEY ("game_statistics_id") REFERENCES "GameStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatistics" ADD CONSTRAINT "GameStatistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatistics" ADD CONSTRAINT "GameStatistics_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
