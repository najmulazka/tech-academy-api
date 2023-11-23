-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "noTelp" TEXT,
    "kota" TEXT,
    "negara" TEXT,
    "gambarProfile" TEXT,
    "fileId" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "deskripsi" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipe" (
    "id" SERIAL NOT NULL,
    "tipeKelas" TEXT NOT NULL,

    CONSTRAINT "Tipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "namaLevel" TEXT NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" SERIAL NOT NULL,
    "namaKategori" TEXT NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "kodeKelas" TEXT NOT NULL,
    "namaKelas" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "materi" TEXT NOT NULL,
    "vidio" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "tipeId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "kategoriId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "metode" TEXT NOT NULL,
    "tanggalBayar" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "kodeKelas" TEXT NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_kodeKelas_key" ON "Kelas"("kodeKelas");

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_tipeId_fkey" FOREIGN KEY ("tipeId") REFERENCES "Tipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_kodeKelas_fkey" FOREIGN KEY ("kodeKelas") REFERENCES "Kelas"("kodeKelas") ON DELETE RESTRICT ON UPDATE CASCADE;
