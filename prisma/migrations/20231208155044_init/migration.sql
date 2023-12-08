/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `cardNumber` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentMethod` on table `Transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "paymentDate",
ADD COLUMN     "cardNumber" TEXT NOT NULL,
ALTER COLUMN "paymentMethod" SET NOT NULL;
