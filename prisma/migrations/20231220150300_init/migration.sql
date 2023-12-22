/*
  Warnings:

  - You are about to drop the column `isView` on the `Chapters` table. All the data in the column will be lost.
  - You are about to drop the column `chapterId` on the `Learning` table. All the data in the column will be lost.
  - Added the required column `lessonId` to the `Learning` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Learning" DROP CONSTRAINT "Learning_chapterId_fkey";

-- AlterTable
ALTER TABLE "Chapters" DROP COLUMN "isView";

-- AlterTable
ALTER TABLE "Learning" DROP COLUMN "chapterId",
ADD COLUMN     "is_buy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lessons" ADD COLUMN     "isView" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
