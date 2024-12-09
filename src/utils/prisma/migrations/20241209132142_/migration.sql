-- CreateTable
CREATE TABLE "Facilities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "mediaId" UUID,

    CONSTRAINT "Facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacilitiesToSpaces" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FacilitiesToSpaces_AB_unique" ON "_FacilitiesToSpaces"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilitiesToSpaces_B_index" ON "_FacilitiesToSpaces"("B");

-- AddForeignKey
ALTER TABLE "Facilities" ADD CONSTRAINT "Facilities_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilitiesToSpaces" ADD CONSTRAINT "_FacilitiesToSpaces_A_fkey" FOREIGN KEY ("A") REFERENCES "Facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilitiesToSpaces" ADD CONSTRAINT "_FacilitiesToSpaces_B_fkey" FOREIGN KEY ("B") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
