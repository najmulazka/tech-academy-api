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
      linkSosmed,
      isFree,
      levelName,
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

    if(!category){
      return res.status(400).json({
        status: false, 
        message: 'Bad Request',
        err: 'category id does not exist',
        data : null
      })
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
        price: Number(price),
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
    let {search, latest, popular, categoryId, levelName, isFree, limit = 10, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.class.count();
    let pagination = getPagination(req, _count, limit, page);

    if (search && latest && categoryId && levelName && isFree) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    } else if (search && popular && categoryId && levelName && isFree) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (popular && categoryId && levelName && isFree) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (latest && categoryId && levelName && isFree) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (search && popular && levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest && levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (search && popular && categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest && categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (search && popular && categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
          levelName: { in: levels },
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest && categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
          levelName: { in: levels },
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (categoryId && levelName && isFree) {
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
    }else if (popular && levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (latest && levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          levelName: { in: levels },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (popular && categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (latest && categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (popular && categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
        },
        orderBy:{
          views: "desc"
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
    }else if (latest && categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          categoryId: { in: categorys },
          levelName: { in: levels },
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (search && levelName && isFree) {
      let levels = levelName.split("-");
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
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
    }else if (search && categoryId && isFree) {
      let categorys = categoryId.split("-").map(Number);
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
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
    }else if (search && categoryId && levelName) {
      let categorys = categoryId.split("-").map(Number);
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
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
    }else if (search && popular && isFree) {
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          isFree,
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest && isFree) {
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          isFree,
        },
        orderBy:{
          createdAt: "desc"
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
    }else if(search && popular && levelName) {
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          levelName: { in: levels },
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest && levelName) {
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          levelName: { in: levels },
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (search && popular && categoryId) {
      let categorys = categoryId.split("-").map(Number);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest && categoryId ) {
      let categorys = categoryId.split("-").map(Number);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
          categoryId: { in: categorys },
        },
        orderBy:{
          createdAt: "desc"
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
    }else if (levelName && isFree) {
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
    }else if (categoryId && isFree) {
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
    }else if (categoryId && levelName) {
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
    }else if (search && isFree) {
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
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
    }else if (search && levelName) {
      let levels = levelName.split("-");
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
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
    }else if (search && popular ) {
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
        },
        orderBy:{
          views: "desc"
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
    }else if (search && latest) {
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
        },
        orderBy:{
          createdAt: "desc"
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
    }else if ( isFree) {
      isFree = JSON.parse(isFree);
      const result = await prisma.class.findMany({
        where: {
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
    }else if (popular) {
      const result = await prisma.class.findMany({
        orderBy:{
          views: "desc"
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
    }else if (latest) {
      const result = await prisma.class.findMany({
        orderBy:{
          createdAt: "desc"
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
    }else if (search) {
      const result = await prisma.class.findMany({
        where: {
          className:{
            contains: search
          },
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
    } else {
      const result = await prisma.class.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

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
    let { classCode } = req.params;

    if (!classCode) {
      return res.status(400).json({
        status: false,
        message: "classcode is required",
        data: null,
      });
    }

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "classCode not exist",
        data: null,
      });
    }

    await prisma.class.update({
      where: { classCode: classCode },
      data: { views: { increment: 1 } },
    });

    const updatedClassWithViews = await prisma.class.findUnique({
      where: { classCode: classCode },
      include: { chapters: true },
    });

    if (!updatedClassWithViews) {
      return res.status(400).json({
        status: false,
        message: "classCode not exist",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "getById class successfully",
      data: updatedClassWithViews,
    });
  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { classCode } = req.params;
    const {
      className,
      description,
      price,
      linkSosmed,
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
  updateClass,
  deleteClass,
};
