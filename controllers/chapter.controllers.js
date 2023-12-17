const prisma = require("../utils/libs/prisma.libs");

const createChapter = async (req, res, next) => {
  try {
    let { chapterName, classCode, is_preview } = req.body;

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
      data: { chapterName, classCode, is_preview: JSON.parse(is_preview) },
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
  updateChapter,
  deletedChapter,
};
