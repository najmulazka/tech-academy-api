const prisma = require('../utils/libs/prisma.libs');
const imagekit = require('../utils/libs/imagekit.libs');
const path = require('path');
const { getPagination } = require('../utils/libs/pagination.libs');
const { generateClassCode } = require('../utils/libs/classcode.libs');

const createClass = async (req, res, next) => {
  try {
    let { className, description, price, linkSosmed, isFree, levelName, createdBy, categoryId } = req.body;
    console.log(req.body);
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'File is required',
        data: null,
      });
    }

    let strFile = req.file.buffer.toString('base64');
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
        message: 'Bad Request',
        err: 'category id does not exist',
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
        createdBy,
        price: Number(price),
        linkSosmed,
        isFree: JSON.parse(isFree),
        levelName,
        categoryId: Number(categoryId),
      },
    });

    res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: classs,
    });
  } catch (err) {
    next(err);
  }
};

const getAllClass = async (req, res, next) => {
  try {
    let { search, latest, popular, categoryId, levelName, isFree, limit = 10, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const _count = await prisma.class.count();
    let pagination = getPagination(req, _count, limit, page);

    // cara yng gak nyusahin umat
    let where = {};
    let orderBy = {};
    if (search) {
      where.className = {
        contains: search,
      };
    }
    if (latest) {
      orderBy.createdAt = 'desc';
    }
    if (popular) {
      orderBy.views = 'desc';
    }
    if (categoryId) {
      let categorys = categoryId.split('-').map(Number);
      where.categoryId = { in: categorys };
    }
    if (levelName) {
      let levels = levelName.split('-');
      where.levelName = { in: levels };
    }
    if (isFree) {
      isFree = JSON.parse(isFree);
      where.isFree = isFree;
    }

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
      message: 'OK',
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
      include: { chapters: true },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: 'classCode not exist',
        data: null,
      });
    }


    // find transaction where user_id = user.id(kalo user login) and class_id = class.fileId
    let transactions = await prisma.transactions.findUnique({
      where: {
        userId: req.user.id,
        classCode,
      },
    });

    // if transaction ada -> then -> isBuy = true
    if (transactions) {
      isBuy = true;
    }

    let isBuy = await prisma.transactions.findFirst({
      where: {
        userId: req.user.id,
        classCode: classCode,
      },
    });
    
    let chaptersWithPreview = existingClass.chapters.map((chapter, index) => ({
      ...chapter,
      is_preview: index === 0, 
    }));
    
    res.status(200).json({
      status: true,
      message: "getById class successfully",
      data: {
        ...existingClass,
        is_buy: Boolean(isBuy),
        chapters: chaptersWithPreview,
      },
    });

  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { classCode } = req.params;
    const { className, description, price, linkSosmed, createdBy, isFree, levelName, categoryId } = req.body;

    const existingClass = await prisma.class.findUnique({
      where: { classCode: classCode },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: 'class with the provided classCode does not exist',
        data: null,
      });
    }

    console.log(typeof className);
    console.log(typeof description);
    console.log(typeof price);
    console.log(typeof linkSosmed);
    console.log(typeof createdBy);
    console.log(typeof isFree);
    console.log(typeof levelName);
    console.log(typeof categoryId);
    console.log( className);
    console.log( description);
    console.log( price);
    console.log( linkSosmed);
    console.log( createdBy);
    console.log( isFree);
    console.log( levelName);
    console.log( categoryId);
    

    const updatedClass = await prisma.class.update({
      where: { classCode: classCode },
      data: {
        className,
        description,
        price: Number(price),
        linkSosmed,
        createdBy,
        isFree : JSON.parse(isFree),
        levelName,
        categoryId: Number(categoryId),
      },
    });

    res.status(200).json({
      status: true,
      message: 'OK',
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
        message: 'classCode is required',
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
        message: 'class with the provided classCode does not exist',
        data: null,
      });
    }

    const deletedClass = await prisma.class.delete({
      where: { classCode: classCode },
      include: { chapters: true },
    });

    res.status(200).json({
      status: true,
      message: 'class deleted successfully',
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
