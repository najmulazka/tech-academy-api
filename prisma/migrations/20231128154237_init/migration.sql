/*
  Warnings:

  - A unique constraint covering the columns `[categoryName]` on the table `Categorys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Categorys_categoryName_key" ON "Categorys"("categoryName");
