/*
  Warnings:

  - Added the required column `is_preview` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "is_preview" TEXT NOT NULL;
