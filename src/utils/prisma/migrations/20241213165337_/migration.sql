/*
  Warnings:

  - You are about to drop the `Facilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FacilitiesToSpaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Facilities" DROP CONSTRAINT "Facilities_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "_FacilitiesToSpaces" DROP CONSTRAINT "_FacilitiesToSpaces_A_fkey";

-- DropForeignKey
ALTER TABLE "_FacilitiesToSpaces" DROP CONSTRAINT "_FacilitiesToSpaces_B_fkey";

-- DropTable
DROP TABLE "Facilities";

-- DropTable
DROP TABLE "_FacilitiesToSpaces";
