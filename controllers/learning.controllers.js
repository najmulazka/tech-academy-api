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
      orderBy: { id: "asc" }, // Order by creation date, you can change this based on your requirement
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
    let {
      search,
      latest,
      popular,
      promo,
      categoryId,
      levelName,
      isFree,
      inProgress,
      limit = 1000,
      page = 1,
    } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.learning.count();
    let pagination = getPagination(req, _count, limit, page);

    let where = {};
    let gt = { gt: 0 };
    let orderBy = [];

    if (search) {
      where = {
        OR: [
          { class: { className: { contains: search, mode: "insensitive" } } },
          { lesson: { title: { contains: search, mode: "insensitive" } } },
        ],
      };
    }

    if (latest) {
      orderBy.push({ class: { createdAt: "desc" } });
    }

    if (popular) {
      orderBy.push({ class: { views: "desc" } });
    }

    if (promo) {
      where.class = { promo: gt };
    }

    if (inProgress) {
      inProgress = JSON.parse(inProgress);
      where.inProgress = inProgress;
    }

    if (categoryId) {
      let categorys = categoryId.split("-").map(Number);
      where.class = { categoryId: { in: categorys } };
    }

    if (levelName) {
      let levels = levelName.split("-");
      where.class = { levelName: { in: levels } };
    }

    if (isFree) {
      isFree = JSON.parse(isFree);
      where.class = { isFree: isFree };
    }

    const allLearning = await prisma.learning.findMany({
      where: {
        ...where,
        users: { id: req.user.id },
      },
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
      orderBy: orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Membuat objek untuk menyimpan data untuk setiap classCode
    const classCodeData = {};

    // Memproses semua data dan memilih classCode dengan presentase tertinggi
    allLearning.forEach((item) => {
      const lowercaseClassCode = item.class.classCode.toLowerCase();
      if (!classCodeData[lowercaseClassCode] || item.presentase > classCodeData[lowercaseClassCode].presentase) {
        classCodeData[lowercaseClassCode] = {
          ...item,
          prevPresentase: undefined,
        };
      }
    });

    // Mengonversi objek menjadi array
    const resultData = Object.values(classCodeData);

    res.status(200).json({
      status: true,
      message: "OK!",
      data: { pagination, allLearning: resultData },
    });
  } catch (error) {
    next(error);
  }
};


const getLearningByClassCode = async (req, res, next) => {
  try {
    const { classCode } = req.params;

    const learning = await prisma.learning.findMany({
      where: {
        class: { classCode: classCode },
        users: { id: req.user.id }, // Filter berdasarkan ID pengguna
        // presentase: { not: 0 }, // Hanya tampilkan yang presentasenya tidak sama dengan 0
      },
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

    // Menyaring catatan di mana presentase adalah 0
    const filteredLearning = learning
      .filter((item) => item.presentase !== 0)
      .map(({ prevPresentase, ...rest }) => rest);

    if (!filteredLearning || filteredLearning.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Pembelajaran tidak ditemukan untuk classCode yang diberikan.",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "OK!",
      data: filteredLearning,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLearningByClassCode,
  getAllLearning,
  allLearningClassCode,
};
