-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_user_id_fkey";

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
