-- CreateTable
CREATE TABLE "medias" (
    "id" UUID NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "client_id" UUID,
    "specialist_id" UUID,
    "education_id" UUID,
    "file_type" "media_type" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medias_client_id_key" ON "medias"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "medias_education_id_key" ON "medias"("education_id");
