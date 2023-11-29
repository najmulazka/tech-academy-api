const prisma = require("../utils/libs/prisma.libs");
const imagekit = require("../utils/libs/imagekit.libs");
const path = require("path");
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
    let { categoryId, levelName, isFree } = req.query;
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
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: result,
      });
    } else if (categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
        },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: result,
      });
    } else if (categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          isFree,
        },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: result,
      });
    } else if (levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);

      const result = await prisma.class.findMany({
        where: {
          levelName: { in: levels },
          isFree,
        },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: result,
      });
    } else if (categoryId) {
      let categorys = categoryId.split("-").map(Number);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
        },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: result,
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
        data: result,
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
        data: result,
      });
    } else {
      const result = await prisma.class.findMany();

      res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: result,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { createClass, getAllClass };
