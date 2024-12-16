-- CreateTable
CREATE TABLE "linked_spaces" (
    "id" UUID NOT NULL,
    "mentor_id" UUID NOT NULL,
    "space_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linked_spaces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "linked_spaces" ADD CONSTRAINT "linked_spaces_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linked_spaces" ADD CONSTRAINT "linked_spaces_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
