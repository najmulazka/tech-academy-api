/*
  Warnings:

  - You are about to drop the column `classCode` on the `Lessons` table. All the data in the column will be lost.
  - Added the required column `linkSosmed` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lessons" DROP CONSTRAINT "Lessons_classCode_fkey";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "linkSosmed" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lessons" DROP COLUMN "classCode";
