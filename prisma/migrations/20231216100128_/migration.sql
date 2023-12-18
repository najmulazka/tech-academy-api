/*
  Warnings:

  - The `is_preview` column on the `Class` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "is_preview",
ADD COLUMN     "is_preview" BOOLEAN NOT NULL DEFAULT false;
