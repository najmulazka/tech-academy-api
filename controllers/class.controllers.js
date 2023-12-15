const prisma = require("../utils/libs/prisma.libs");
const imagekit = require("../utils/libs/imagekit.libs");
const path = require("path");
const { getPagination } = require("../utils/libs/pagination.libs");
const { generateClassCode } = require("../utils/libs/classcode.libs");

const createClass = async (req, res, next) => {
  try {
    let {
      className,
      description,
      price,
      promo,
      linkSosmed,
      isFree,
      levelName,
      author,
      categoryId,
    } = req.body;
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "File is required",
        data: null,
      });
    }

    let strFile = req.file.buffer.toString("base64");
    const { url, fileId } = await imagekit.upload({
      fileName: Date.now() + path.extname(req.file.originalname),
      file: strFile,
    });

    let category = await prisma.categorys.findUnique({
      where: { id: Number(categoryId) },
      select: { categoryName: true },
    });

    if (!category) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "category id does not exist",
        data: null,
      });
    }

    let classCode = generateClassCode(category.categoryName);

    let countClass = await prisma.class.count();
    classCode += countClass.toString();

    const classs = await prisma.class.create({
      data: {
        classCode,
        className,
        description,
        thumbnailPicture: url,
        fileId,
        author,
        price: Number(price),
        promo: Number(promo),
        linkSosmed,
        isFree: JSON.parse(isFree),
        levelName,
        categoryId: Number(categoryId),
      },
    });

    res.status(200).json({
      status: true,
      message: "OK",
      err: null,
      data: classs,
    });
  } catch (err) {
    next(err);
  }
};

const getAllClass = async (req, res, next) => {
  try {
    let {
      search,
      latest,
      popular,
      promo,
      categoryId,
      levelName,
      isFree,
      limit = 10,
      page = 1,
    } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.class.count();
    let pagination = getPagination(req, _count, limit, page);

    // cara yng gak nyusahin umat
    let where = {};
    let gt = { gt: 0 };
    let orderBy = {};
    if (search) {
      where.className = {
        contains: search,
      };
    }
    if (latest) {
      orderBy.createdAt = "desc";
    }
    if (popular) {
      orderBy.views = "desc";
    }
    if (promo) {
      where.promo = gt;
    }
    if (categoryId) {
      let categorys = categoryId.split("-").map(Number);
      where.categoryId = { in: categorys };
    }
    if (levelName) {
      let levels = levelName.split("-");
      where.levelName = { in: levels };
    }
    if (isFree) {
      isFree = JSON.parse(isFree);
      where.isFree = isFree;
    }

    console.log(where);

    const result = await prisma.class.findMany({
      where,
      include: {
        categorys: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    res.status(200).json({
      status: true,
      message: "OK",
      err: null,
      data: { pagination, result },
    });
  } catch (err) {
    next(err);
  }
};

const getByIdClass = async (req, res, next) => {
  try {
    let { classCode } = req.params;

    if (!classCode) {
      return res.status(400).json({
        status: false,
        message: "classcode is required",
        data: null,
      });
    }

    await prisma.class.update({
      where: { classCode: classCode },
      data: { views: { increment: 1 } },
    });

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
      include: { chapters: true, learning: true },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "classCode not exist",
        data: null,
      });
    }

    // mapping is_preview = true for chapter 1
    // const previewChapter = await prisma.chapter.map((chapter) => {
    //   if (chapter.id = id) {
    //     return { ...chapter, is_preview: true };
    //   }
    //   return chapter;
    // });


    // let isBuy = false;
    // // find transaction where user_id = user.id(kalo user login) and class_id = class.fileId
    // let transactions = await prisma.transactions.findUnique({
    //   where:{
    //     userId : req.user.id,
    //     classCode
    //   }})

    // // if transaction ada -> then -> isBuy = true
    // if(transactions){
    //   isBuy = true
    // }

    // res.status(200).json({
    //   status: true,
    //   message: 'getById class successfully',
    //   data: { ...existingClass, is_buy: isBuy },
    // });
    res.status(200).json({
      status: true,
      message: "getById class successfully",
      data: { ...existingClass, is_buy: isBuy },
    });
  } catch (err) {
    next(err);
  }
};

const getIdClassProgress = async (req, res, next) => {
  try {
    let { classCode } = req.params;

    if (!classCode) {
      return res.status(400).json({
        status: false,
        message: 'classcode is required',
        data: null,
      });
    }

    await prisma.class.update({
      where: { classCode: classCode },
      data: { views: { increment: 1 } },
    });

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
      include: { chapters: true},
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: 'classCode not exist',
        data: null,
      });
    }

    // Create learning entry for the user
    const userId = req.user.id;

    const learningEntry = await prisma.learning.create({
      data: {
        inProgress: false,
        presentase: 0,
        classCode: classCode,
        userId: userId,
      },
    });

    res.status(200).json({
      status: true,
      message: 'getById class successfully',
      data: { existingClass, learningEntry },
    });
  } catch (err) {
    next(err);
  }
};


const updateClass = async (req, res, next) => {
  try {
    const { classCode } = req.params;
    let {
      className,
      description,
      price,
      promo,
      linkSosmed,
      author,
      isFree,
      levelName,
      categoryId,
    } = req.body;

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

    const updatedClass = await prisma.class.update({
      where: { classCode: classCode },
      data: {
        className,
        description,
        price: Number(price),
        promo: Number(promo),
        linkSosmed,
        author,
        isFree,
        levelName,
        categoryId: Number(categoryId),
      },
    });

    res.status(200).json({
      status: true,
      message: "OK",
      err: null,
      data: updatedClass,
    });
  } catch (err) {
    next(err);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    let { classCode } = req.params;

    if (!classCode) {
      return res.status(400).json({
        status: false,
        message: "classCode is required",
        data: null,
      });
    }

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
      include: { chapters: true },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "class with the provided classCode does not exist",
        data: null,
      });
    }

    const deletedClass = await prisma.class.delete({
      where: { classCode: classCode },
      include: { chapters: true },
    });

    res.status(200).json({
      status: true,
      message: "class deleted successfully",
      data: deletedClass,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createClass,
  getAllClass,
  getByIdClass,
  getIdClassProgress,
  updateClass,
  deleteClass,
};
