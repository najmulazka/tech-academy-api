-- DropForeignKey
ALTER TABLE "Chapters" DROP CONSTRAINT "Chapters_classCode_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "Class"("classCode") ON DELETE CASCADE ON UPDATE CASCADE;
