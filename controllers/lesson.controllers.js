const prisma = require('../utils/libs/prisma.libs');

const getLessons = async (req, res, next) => {
  try {
    const lessons = await prisma.lessons.findMany();
    res.status(200).json({
      status: true,
      message: "Lessons retrieved successfully",
      data: lessons,
    });
  } catch (err) {
    next(err);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const { title, learningMaterial, linkLearningMaterial, chapterId, classCode } = req.body;

    if (!title || !learningMaterial || !linkLearningMaterial || !chapterId || !classCode) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        data: null,
      });
    }

    const existingChapter = await prisma.chapters.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return res.status(400).json({
        status: false,
        message: "Chapter with the provided ID does not exist",
        data: null,
      });
    }

    const newLesson = await prisma.lessons.create({
      data: { title, learningMaterial, linkLearningMaterial, chapterId, classCode },
    });

    res.status(200).json({
      status: true,
      message: "Lesson created successfully",
      data: newLesson,
    });
  } catch (err) {
    next(err);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const lessonId = parseInt(req.params.id);
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return res.status(404).json({
        status: false,
        message: "Lesson not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Lesson retrieved successfully",
      data: lesson,
    });
  } catch (err) {
    next(err);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { title, learningMaterial, linkLearningMaterial } = req.body;

    const updatedLesson = await prisma.lessons.update({
      where: { id: lessonId },
      data: { title, learningMaterial, linkLearningMaterial },
    });

    res.status(200).json({
      status: true,
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLessons,
  createLesson,
  getLessonById,
  updateLesson,
};
