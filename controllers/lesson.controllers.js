const prisma = require("../utils/libs/prisma.libs");

const getLessons = async (req, res, next) => {
  try {
    const lessons = await prisma.lessons.findMany();
    if (!lessons || lessons.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No Lessons Found",
        data: null,
      });
    }
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
    const {
      title,
      learningMaterial,
      linkLearningMaterial,
      chapterId,
      duration,
    } = req.body;

    if (
      !title ||
      !learningMaterial ||
      !linkLearningMaterial ||
      !chapterId ||
      !duration
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields must be filled in",
        data: null,
      });
    }

    const existingChapter = await prisma.chapters.findUnique({
      where: { id: Number(chapterId) },
      include: { class: true },
    });

    if (!existingChapter) {
      return res.status(400).json({
        status: false,
        message: "Chapter with the provided ID does not exist",
        data: null,
      });
    }

    const newLesson = await prisma.lessons.create({
      data: {
        title,
        learningMaterial,
        linkLearningMaterial,
        chapterId,
        duration,
      },
    });

    // update total duration pada chapter
    let totalDurationChapter = existingChapter.totalDuration + duration;
    await prisma.chapters.update({
      where: { id: existingChapter.id },
      data: { totalDuration: totalDurationChapter },
    });

    // update total duration pada Class
    let totalDurationClass = existingChapter.class.totalDuration + duration;
    await prisma.class.update({
      where: { classCode: existingChapter.class.classCode },
      data: { totalDuration: totalDurationClass },
    });

    res.status(200).json({
      status: true,
      message: "Lesson created successfully",
      data: { lesson: newLesson },
    });
  } catch (err) {
    console.error("Error creating lesson:", err);
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
    const {
      title,
      learningMaterial,
      linkLearningMaterial,
      chapterId,
      duration,
    } = req.body;

    // Periksa eksistensi pelajaran
    const existingLesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: { chapters: { include: { class: true } } },
    });

    if (!existingLesson) {
      return res.status(404).json({
        status: false,
        message: "Lesson with the provided ID not found",
        data: null,
      });
    }
    // Periksa eksistensi chapter
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

    const durationChange = duration - existingLesson.duration;

    // Update pelajaran
    const updatedLesson = await prisma.lessons.update({
      where: { id: lessonId },
      data: {
        title,
        learningMaterial,
        linkLearningMaterial,
        chapterId,
        duration,
      },
    });

    if (durationChange !== 0) {
      const updatedTotalDuration =
        existingLesson.chapters.class.totalDuration + durationChange;

      await prisma.class.update({
        where: { classCode: existingLesson.chapters.class.classCode },
        data: { totalDuration: updatedTotalDuration },
      });
    }

    res.status(200).json({
      status: true,
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const lessonId = parseInt(req.params.id);

    const existingLesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return res.status(404).json({
        status: false,
        message: "Lesson with the provided ID not found",
        data: null,
      });
    }

    await prisma.lessons.delete({
      where: { id: lessonId },
    });

    res.status(200).json({
      status: true,
      message: "Lesson deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessons,
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
};
