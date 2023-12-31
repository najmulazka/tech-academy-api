-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "noTelp" TEXT,
    "city" TEXT,
    "country" TEXT,
    "profilePicture" TEXT,
    "fileId" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activationCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "resetCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "deskripsi" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorys" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "thumbnailPictureCategory" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "Categorys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Learning" (
    "id" SERIAL NOT NULL,
    "is_buy" BOOLEAN NOT NULL DEFAULT false,
    "inProgress" BOOLEAN NOT NULL DEFAULT false,
    "presentase" INTEGER NOT NULL DEFAULT 0,
    "prevPresentase" INTEGER NOT NULL DEFAULT 0,
    "classCode" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Learning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "classCode" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailPicture" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "promo" INTEGER NOT NULL DEFAULT 0,
    "linkSosmed" TEXT NOT NULL,
    "levelName" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isFree" BOOLEAN NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "module" INTEGER NOT NULL DEFAULT 0,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classCode")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "classCode" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "id" SERIAL NOT NULL,
    "chapterName" TEXT NOT NULL,
    "classCode" TEXT NOT NULL,
    "is_preview" BOOLEAN NOT NULL DEFAULT false,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lessons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "learningMaterial" TEXT NOT NULL,
    "linkLearningMaterial" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isView" BOOLEAN NOT NULL DEFAULT false,
    "chapterId" INTEGER NOT NULL,

    CONSTRAINT "Lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "bankId" INTEGER,
    "cardName" TEXT,
    "cardNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "classCode" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" SERIAL NOT NULL,
    "bankType" TEXT NOT NULL,
    "bankName" TEXT,
    "bankNumber" TEXT,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationCodes_userId_key" ON "ActivationCodes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResetCodes_userId_key" ON "ResetCodes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Categorys_categoryName_key" ON "Categorys"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Class_classCode_key" ON "Class"("classCode");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_bankType_key" ON "Bank"("bankType");

-- AddForeignKey
ALTER TABLE "ActivationCodes" ADD CONSTRAINT "ActivationCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ResetCodes" ADD CONSTRAINT "ResetCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "Class"("classCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "Class"("classCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "Class"("classCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "Class"("classCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
