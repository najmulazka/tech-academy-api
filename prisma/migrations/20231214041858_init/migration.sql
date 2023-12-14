-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "bankType" TEXT,
ADD COLUMN     "fileId" TEXT,
ADD COLUMN     "struckPicture" TEXT,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "cardNumber" DROP NOT NULL;
