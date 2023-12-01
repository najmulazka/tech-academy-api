const prisma = require("../utils/libs/prisma.libs");

const createChapter = async (req, res, next) => {
  try {
    let { chapterName, classCode } = req.body;

    if (!chapterName || !classCode) {
      return res.status(400).json({
        status: false,
        message: "chapter name and class code are required",
        data: null,
      });
    }

    const newChapter = await prisma.chapters.create({
      data: { chapterName, classCode },
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

    if (!chapters) {
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
    let { chapterName, classCode } = req.body;

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
      data: { chapterName, classCode },
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
