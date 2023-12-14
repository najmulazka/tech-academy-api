/*
  Warnings:

  - You are about to drop the column `fileId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `struckPicture` on the `Transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "fileId",
DROP COLUMN "struckPicture";
