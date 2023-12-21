const prisma = require("../utils/libs/prisma.libs");
const { getPagination } = require("../utils/libs/pagination.libs");

const getAllLearning = async (req, res, next) => {
  try {
    let { search, limit = 5, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.learning.count();
    let pagination = getPagination(req, _count, limit, page);

    let where = {};
    if (search) {
      where = {
        OR: [
          { class: { className: { contains: search } } },
          { lesson: { title: { contains: search } } },
        ],
      };
    }

    const allLearning = await prisma.learning.findMany({
      where,
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
      orderBy: { id: 'asc' }, // Order by creation date, you can change this based on your requirement
      skip: (page - 1) * limit,
      take: limit,
    });

    res.status(200).json({
      status: true,
      message: "OK!",
      data: { pagination, allLearning },
    });
  } catch (error) {
    next(error);
  }
};

const allLearningClassCode = async (req, res, next) => {
  try {
    let { search, limit = 5, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.learning.count();
    let pagination = getPagination(req, _count, limit, page);

    let where = {};
    if (search) {
      where = {
        OR: [
          { class: { className: { contains: search } } },
          { lesson: { title: { contains: search } } },
        ],
      };
    }

    const allLearning = await prisma.learning.findMany({
      where,
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
      orderBy: {
        lessonId: 'asc', // Urutkan berdasarkan lessonId secara ascending
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Eliminate duplicate classCode entries, keep the first occurrence
    const uniqueClassCodes = new Set();
    const filteredLearning = allLearning.filter(item => {
      if (!uniqueClassCodes.has(item.class.classCode)) {
        uniqueClassCodes.add(item.class.classCode);
        return true;
      }
      return false;
    });

    res.status(200).json({
      status: true,
      message: "OK!",
      data: { pagination, allLearning: filteredLearning },
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

module.exports = { getLearningById, getAllLearning, allLearningClassCode };
