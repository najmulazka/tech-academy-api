/*
  Warnings:

  - Added the required column `chapterId` to the `Learning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Learning" ADD COLUMN     "chapterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
