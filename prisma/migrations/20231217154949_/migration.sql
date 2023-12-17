/*
  Warnings:

  - You are about to drop the column `isFree` on the `Chapters` table. All the data in the column will be lost.
  - You are about to drop the column `is_preview` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapters" DROP COLUMN "isFree",
ADD COLUMN     "is_preview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "is_preview";
