const prisma = require("../utils/libs/prisma.libs");

// const updateProgres = async (req, res, next) => {
//   try {
//     // Validasi jika ada classCode yang sama
//     const duplicateClassCode = await prisma.learning.findFirst({
//       where: {
//         userId: req.user.id,
//         inProgress: true,
//       },
//     });

//     if (duplicateClassCode) {
//       return res.status(400).json({
//         status: false,
//         message: "Class is already in progress.",
//         data: null,
//       });
//     }

//     // Set inProgress to true automatically
//     const updatedProgress = await prisma.learning.updateMany({
//       where: {
//         userId: req.user.id,
//       },
//       data: {
//         inProgress: true,
//       },
//     });

//     if (updatedProgress.count === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "Data not found.",
//         data: null,
//       });
//     }

//     // Get updated progress
//     const progress = await prisma.learning.findMany({
//       where: { userId: req.user.id },
//       include: {
//         class: true,
//         users: {
//           select: {
//             id: true,
//             fullName: true,
//             email: true
//           },
//         },
//       },
//     });

//     res.status(200).json({
//       status: true,
//       message: "OK!",
//       data: progress,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getAllLearning = async (req, res, next) => {
  try {
    const allLearning = await prisma.learning.findMany({
      include: {
        class: { include: { categorys: true } },
        lesson: { include: { chapters: true } },
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "OK!",
      data: allLearning,
    });
  } catch (error) {
    next(error);
  }
};

const getLearningById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const learning = await prisma.learning.findUnique({
      where: { id: Number(id) },
      include: {
        class: { include: { categorys: true } },
        lesson: { include: { chapters: true } },
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!learning) {
      return res.status(404).json({
        status: false,
        message: "Learning not found.",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "OK!",
      data: learning,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLearningById, getAllLearning };
