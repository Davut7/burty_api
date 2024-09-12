-- CreateEnum
CREATE TYPE "media_type" AS ENUM ('VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('mentor', 'user');

-- CreateTable
CREATE TABLE "user_tokens" (
    "id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "last_login_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_tokens_user_id_key" ON "user_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
