const prisma = require("../utils/libs/prisma.libs");

const createChapter = async (req, res, next) => {
  try {
    let { chapterName, classCode, isFree } = req.body;

    if (!chapterName || !classCode) {
      return res.status(400).json({
        status: false,
        message: "chapter name and class code are required",
        data: null,
      });
    }

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "class with the provided classCode does not exist",
        data: null,
      });
    }

    const newChapter = await prisma.chapters.create({
      data: { chapterName, classCode, isFree: JSON.parse(isFree) },
    });

    let currentChapterCount = await prisma.chapters.count({
      where: { classCode: classCode },
    });

    let updatedClass = await prisma.class.update({
      where: { classCode: classCode },
      data: { module: currentChapterCount + 1 },
    });

    res.status(200).json({
      status: true,
      message: "chapter created successfully",
      data: newChapter,
      updatedClass,
    });
  } catch (err) {
    next(err);
  }
};

const getChapter = async (req, res, next) => {
  try {
    let chapters = await prisma.chapters.findMany();

    if (!chapters || chapters.length === 0) {
      return res.status(400).json({
        status: false,
        message: "chapter get all not exist",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "chapter get all successfully",
      data: chapters,
    });
  } catch (err) {
    next(err);
  }
};

const getByIdChapter = async (req, res, next) => {
  try {
    let { id } = req.params;

    const chapter = await prisma.chapters.findUnique({
      where: { id: Number(id) },
    });

    if (!chapter || !id) {
      return res.status(400).json({
        status: false,
        message: "chapter get by id not exist",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "chapter get by id successfully",
      data: chapter,
    });
  } catch (err) {
    next(err);
  }
};

const getPresentaseChapter = async (req, res, next) => {
  try {
    const { classCode, id } = req.params;

    const chapter = await prisma.chapters.findUnique({
      where: { id: Number(id), classCode },
    });

    if (!chapter || !id || !classCode) {
      return res.status(400).json({
        status: false,
        message: "Bab dengan ID dan classCode tertentu tidak ditemukan",
        data: null,
      });
    }

    const learning = await prisma.learning.findFirst({
      where: {
        chapterId: chapter.id,
        userId: req.user.id,
      },
    });

    if (!learning) {
      // Jika learning untuk bab ini belum ada, buat baru
      const newLearning = await prisma.learning.create({
        data: {
          userId: req.user.id,
          chapterId: chapter.id,
          presentase: 0, // Misalnya, presentase dimulai dari 0 karena baru dimulai
          classCode: classCode,
          previousPresentase: 0, // Setel previousPresentase ke 0 saat membuat baru
        },
      });

      return res.status(200).json({
        status: true,
        message: "Rekam belajar baru telah dibuat untuk bab tertentu",
        data: {
          chapter,
          presentase: newLearning.presentase,
        },
      });
    }

    const totalChapters = await prisma.chapters.count({
      where: { classCode },
    });

    // Pastikan bahwa previousPresentase memiliki nilai numerik yang valid
    const previousPresentase = typeof learning.previousPresentase === 'number' ? learning.previousPresentase : 0;

    // Hitung presentase berdasarkan total jumlah bab dan tambahkan ke previousPresentase
    const presentase = previousPresentase + (chapter.id / totalChapters) * 100;

    // Perbarui kolom presentase dan previousPresentase di tabel Learning
    await prisma.learning.update({
      where: { id: learning.id },
      data: { presentase, previousPresentase: presentase },
    });

    res.status(200).json({
      status: true,
      message: "Detail bab diambil dengan berhasil, dan presentase diperbarui",
      data: {
        chapter,
        presentase,
      },
    });
  } catch (err) {
    next(err);
  }
};



const updateChapter = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { chapterName, classCode, isFree } = req.body;

    const existingChapter = await prisma.chapters.findUnique({
      where: { id: Number(id) },
    });

    if (!existingChapter || !id) {
      return res.status(400).json({
        status: false,
        message: "chapter id not exist",
        data: null,
      });
    }

    if (!chapterName || !classCode) {
      return res.status(400).json({
        status: false,
        message: "chapter name and class code are required",
        data: null,
      });
    }

    const updatedChapter = await prisma.chapters.update({
      where: { id: Number(id) },
      data: { chapterName, classCode, isFree: JSON.parse(isFree) },
    });

    res.status(200).json({
      status: true,
      message: "chapter updated successfully",
      data: updatedChapter,
    });
  } catch (err) {
    next(err);
  }
};

const deletedChapter = async (req, res, next) => {
  try {
    let { id } = req.params;

    const existingChapter = await prisma.chapters.findUnique({
      where: { id: Number(id) },
    });

    if (!existingChapter || !id) {
      return res.status(400).json({
        status: false,
        message: "chapter id not exist",
        data: null,
      });
    }

    const deletedChapter = await prisma.chapters.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      status: true,
      message: "chapter deleted successfully",
      data: deletedChapter,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createChapter,
  getChapter,
  getByIdChapter,
  getPresentaseChapter,
  updateChapter,
  deletedChapter,
};
