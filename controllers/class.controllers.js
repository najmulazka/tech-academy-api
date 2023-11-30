const prisma = require('../utils/libs/prisma.libs');
const imagekit = require('../utils/libs/imagekit.libs');
const path = require('path');
const { getPagination } = require('../utils/libs/pagination.libs');
const { generateClassCode } = require("../utils/libs/classcode.libs");

const createClass = async (req, res, next) => {
  try {
    let { className, description, price, isFree, levelName, categoryId } =
      req.body;
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
        price: Number(price),
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
    let { categoryId, levelName, isFree, limit = 10, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.class.count();
    let pagination = getPagination(req, _count, limit, page);

    if (categoryId && levelName && isFree) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
          isFree,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else if (categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else if (categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          isFree,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else if (levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);

      const result = await prisma.class.findMany({
        where: {
          levelName: { in: levels },
          isFree,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else if (categoryId) {
      let categorys = categoryId.split("-").map(Number);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else if (levelName) {
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          levelName: { in: levels },
        },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else if (isFree) {
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          isFree,
        },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    } else {
      const result = await prisma.class.findMany({ skip: (page - 1) * limit, take: limit });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { pagination, result },
      });
    }
  } catch (err) {
    next(err);
  }
};

const getByIdClass = async (req, res, next) => {
  try {
    const { classCode } = req.params;
    const classes = await prisma.class.findUnique({
      where: { classCode: classCode },
    });

    if (!classes) {
      return res.status(400).json({
        status: false,
        message: "Not Found",
        err: "Class not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "getById class successfully",
      err: null,
      data: classes,
    });
  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { classCode } = req.params;
    const { className, description, price, isFree, levelName, categoryId } =
      req.body;

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "Not Found",
        err: "Class not found",
        data: null,
      });
    }

    const updatedClass = await prisma.class.update({
      where: { classCode: classCode },
      data: {
        className,
        description,
        price: Number(price),
        isFree: JSON.parse(isFree),
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

module.exports = { createClass, getAllClass, getByIdClass, updateClass };
