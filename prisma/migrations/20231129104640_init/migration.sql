/*
  Warnings:

  - You are about to drop the `CategoriesOnClass` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnClass" DROP CONSTRAINT "CategoriesOnClass_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnClass" DROP CONSTRAINT "CategoriesOnClass_classCode_fkey";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CategoriesOnClass";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
