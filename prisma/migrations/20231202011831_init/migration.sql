-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentDate" DROP NOT NULL;
