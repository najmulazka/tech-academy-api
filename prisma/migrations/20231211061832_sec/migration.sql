/*
  Warnings:

  - Added the required column `createdBy` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "createdBy" TEXT NOT NULL;
