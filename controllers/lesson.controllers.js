const prisma = require("../utils/libs/prisma.libs");

const getLessons = async (req, res, next) => {
  try {
    const lessons = await prisma.lessons.findMany({
      orderBy: {
        id: "asc",
      },
    });
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
      include: {
        chapters: {
          select: {
            chapterName: true,
          },
        },
      },
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

const getPresentaseLesson = async (req, res, next) => {
  try {
    const { classCode, id } = req.params;
    const userId = req.user.id;

    const lesson = await prisma.lessons.findUnique({
      where: { id: Number(id) },
      include: { chapters: { include: { class: true } } },
    });

    if (!lesson || !id || !classCode) {
      return res.status(400).json({
        status: false,
        message: "Pelajaran dengan ID tertentu tidak ditemukan",
        data: null,
      });
    }

    // Set isView to true when hitting the endpoint
    console.log("Before updating isView:", lesson.isView);
    await prisma.lessons.update({
      where: { id: Number(id) },
      data: { isView: true },
    });
    console.log("After updating isView:", true);

    const lessonClassCode = lesson.chapters.classCode;

    if (classCode !== lessonClassCode) {
      return res.status(400).json({
        status: false,
        message:
          "Kode kelas dan Id lesson tidak sesuai dengan pelajaran yang diminta",
        data: null,
      });
    }

    // Check if the lesson is free
    let isBuy = false;
    if (!lesson.is_free) {
      const isBuyData = await prisma.transactions.findFirst({
        where: {
          classCode: lessonClassCode,
          userId: userId,
          status: true,
        },
      });

      if (!isBuyData) {
        // Update isView to false if is_buy is false
        await prisma.lessons.update({
          where: { id: Number(id) },
          data: { isView: false },
        });

        return res.status(403).json({
          status: false,
          message: "Pelajaran ini tidak dapat diakses karena tidak gratis",
          data: {
            lesson,
            presentase: 0,
            learning: null,
            is_buy: false,
          },
        });
      } else {
        isBuy = isBuyData; // Assign the data to isBuy
      }
    }

    const learning = await prisma.learning.findFirst({
      where: {
        lessonId: lesson.id,
        userId: userId,
      },
    });

    // Update isView on the Learning model for the specific user
    await prisma.learning.update({
      where: { id: learning.id },
      data: { isView: true },
    });

    if (!learning) {
      const newLearning = await prisma.learning.create({
        data: {
          userId: userId,
          lessonId: lesson.id,
          presentase: 0,
          classCode: lessonClassCode,
          prevPresentase: 0,
          inProgress: false,
          is_buy: isBuy ? isBuy.status : false, // Set is_buy based on transaction status
        },
      });

      return res.status(200).json({
        status: true,
        message: "Rekam belajar baru telah dibuat untuk pelajaran tertentu",
        data: {
          lesson,
          presentase: Math.round(newLearning.presentase),
          learning: { ...newLearning, inProgress: false },
        },
      });
    }

    // Calculate presentase based on total isView in the classCode for the specific user
    const totalIsViewForUser = await prisma.learning.count({
      where: {
        userId: userId,
        classCode: lessonClassCode,
        isView: true,
      },
    });

    const totalLessonsInClassForUser = await prisma.learning.count({
      where: {
        userId: userId,
        classCode: lessonClassCode,
      },
    });

    console.log("Total isView for user:", totalIsViewForUser);
    console.log("Total lessons in class for user:", totalLessonsInClassForUser);

    const calculatedPresentaseForUser =
      (totalIsViewForUser / totalLessonsInClassForUser) * 100;
    const finalPresentaseForUser = Math.min(
      100,
      Math.round(calculatedPresentaseForUser / 10) * 10
    );

    if (calculatedPresentaseForUser < 101) {
      await prisma.learning.update({
        where: { id: learning.id },
        data: {
          presentase: finalPresentaseForUser,
          prevPresentase: finalPresentaseForUser,
          inProgress: true,
          is_buy: isBuy ? isBuy.status : false, // Set is_buy based on transaction status
        },
      });

      const excludedLessonIds = await prisma.learning.findMany({
        where: {
          userId: userId,
          lessonId: { not: lesson.id },
        },
        select: {
          id: true,
        },
      });

      await prisma.learning.updateMany({
        where: {
          userId: userId,
          lessonId: { in: excludedLessonIds.map((less) => less.id) },
        },
        data: { presentase: 0, prevPresentase: 0 },
      });
    }

    const updatedLearning = await prisma.learning.findFirst({
      where: {
        lessonId: lesson.id,
        userId: userId,
      },
      select: {
        inProgress: true,
        classCode: true,
        lessonId: true,
        userId: true,
        is_buy: true,
      },
    });

    res.status(200).json({
      status: true,
      message:
        "Detail pelajaran diambil dengan berhasil, dan presentase diperbarui",
      data: {
        lesson,
        presentase: Math.round(finalPresentaseForUser),
        learning: updatedLearning,
        is_buy: Boolean(isBuy),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lessonId = Number(req.params.id);
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

    // update pelajaran
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
      // update total duration pada chapter
      let updatedTotalDurationChapter =
        existingChapter.totalDuration + durationChange;
      await prisma.chapters.update({
        where: { id: existingLesson.chapters.id },
        data: { totalDuration: updatedTotalDurationChapter },
      });

      // update total duration pada class
      let updatedTotalDurationClass =
        existingLesson.chapters.class.totalDuration + durationChange;
      await prisma.class.update({
        where: { classCode: existingLesson.chapters.class.classCode },
        data: { totalDuration: updatedTotalDurationClass },
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
    const lessonId = Number(req.params.id);

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

    // kurangi total duration pada chapter dan class
    let updatedTotalDurationChapter =
      existingLesson.chapters.totalDuration - existingLesson.duration;

    await prisma.chapters.update({
      where: { id: existingLesson.chapterId },
      data: { totalDuration: updatedTotalDurationChapter },
    });

    let updatedTotalDurationClass =
      existingLesson.chapters.class.totalDuration - existingLesson.duration;

    await prisma.class.update({
      where: { classCode: existingLesson.chapters.class.classCode },
      data: { totalDuration: updatedTotalDurationClass },
    });

    // hapus lesson
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
  getPresentaseLesson,
  updateLesson,
  deleteLesson,
};
