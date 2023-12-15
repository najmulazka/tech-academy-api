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
    let chapters = await prisma.chapters.findMany({
      include: { Lessons: true },
    });

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
      include: { Lessons: true },
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
      include: { class: true },
    });

    if (!chapter || !id || !classCode) {
      return res.status(400).json({
        status: false,
        message: "Bab dengan ID dan classCode tertentu tidak ditemukan",
        data: null,
      });
    }

    // Set isView to true when hitting the endpoint
    await prisma.chapters.update({
      where: { id: Number(id) },
      data: { isView: true },
    });

    if (!chapter.isFree) {
      const learning = await prisma.learning.findFirst({
        where: {
          chapterId: chapter.id,
          userId: req.user.id,
        },
      });

      if (!learning) {
        return res.status(403).json({
          status: false,
          message: "Bab ini tidak dapat diakses karena tidak gratis",
          data: {
            chapter,
            presentase: 0,
            learning: null,
          },
        });
      }

      return res.status(403).json({
        status: false,
        message: "Bab ini tidak dapat diakses karena tidak gratis",
        data: {
          chapter,
          presentase: Math.round(learning.presentase), // Bulatkan presentase
          learning: { ...learning, inProgress: false }, // Set inProgress menjadi false pada data learning
        },
      });
    }

    const learning = await prisma.learning.findFirst({
      where: {
        chapterId: chapter.id,
        userId: req.user.id,
      },
    });

    if (!learning) {
      const newLearning = await prisma.learning.create({
        data: {
          userId: req.user.id,
          chapterId: chapter.id,
          presentase: 0,
          classCode: classCode,
          prevPresentase: 0,
          inProgress: false,
        },
      });

      return res.status(200).json({
        status: true,
        message: "Rekam belajar baru telah dibuat untuk bab tertentu",
        data: {
          chapter,
          presentase: Math.round(newLearning.presentase), // Bulatkan presentase
          learning: { ...newLearning, inProgress: false }, // Set inProgress menjadi false pada data learning
        },
      });
    }

    // Calculate presentase based on total isView in the classCode
    const totalIsView = await prisma.chapters.count({
      where: { classCode, isView: true },
    });

    // Calculate presentase based on total isView in the classCode
    const totalChaptersInClass = await prisma.chapters.count({
      where: { classCode },
    });

    const calculatedPresentase = (totalIsView / totalChaptersInClass) * 100;
    const finalPresentase =
      calculatedPresentase === 101
        ? Math.round(learning.presentase)
        : Math.round(calculatedPresentase / 10) * 10; // Bulatkan ke puluhan

    if (calculatedPresentase < 101) {
      await prisma.learning.update({
        where: { id: learning.id },
        data: {
          presentase: finalPresentase,
          prevPresentase: finalPresentase,
          inProgress: true,
        },
      });

      const excludedChapterIds = await prisma.chapters.findMany({
        where: { classCode, id: { not: chapter.id } },
        select: { id: true },
      });

      await prisma.learning.updateMany({
        where: {
          userId: req.user.id,
          chapterId: { in: excludedChapterIds.map((chap) => chap.id) },
        },
        data: { presentase: 0, prevPresentase: 0 },
      });
    }

    // Ambil data learning terbaru setelah diupdate
    const updatedLearning = await prisma.learning.findFirst({
      where: {
        chapterId: chapter.id,
        userId: req.user.id,
      },
      select: {
        inProgress: true,
        classCode: true,
        chapterId: true,
        userId: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "Detail bab diambil dengan berhasil, dan presentase diperbarui",
      data: {
        chapter,
        presentase: Math.round(finalPresentase), // Bulatkan presentase
        learning: updatedLearning,
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
