/*
  Warnings:

  - Added the required column `isFree` to the `Chapters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapters" ADD COLUMN     "isFree" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "inProgres" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "learn" INTEGER NOT NULL DEFAULT 0;
