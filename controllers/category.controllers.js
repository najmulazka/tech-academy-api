const prisma = require("../utils/libs/prisma.libs");
const imagekit = require("../utils/libs/imagekit.libs");
const path = require("path");

const createCategory = async (req, res, next) => {
  try {
    let { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        status: false,
        message: "category code are required",
        data: null,
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: false,
        message: "file is required",
        data: null,
      });
    }

    let existingCategory = await prisma.categorys.findUnique({
      where: { categoryName: categoryName },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: false,
        message: "category with the same name already exists",
        data: null,
      });
    }

    let strFile = req.file.buffer.toString("base64");
    const { url, fileId } = await imagekit.upload({
      fileName: Date.now() + path.extname(req.file.originalname),
      file: strFile,
    });

    const newCategory = await prisma.categorys.create({
      data: { categoryName, thumbnailPictureCategory: url, fileId },
    });
    return res.status(201).json({
      status: true,
      message: "created successfullyy",
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const categories = await prisma.categorys.findMany({
      include: { class: true },
      orderBy: { id: "asc" },
    });

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        status: false,
        message: "categories get all not exist",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "get category successfully",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

const getByIdCategory = async (req, res, next) => {
  try {
    let { id } = req.params;

    const category = await prisma.categorys.findUnique({
      where: { id: Number(id) },
      include: { class: true },
    });

    if (!category || !id) {
      return res.status(400).json({
        status: false,
        message: "categories by id not exist",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "getById category successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { categoryName } = req.body;

    const existingCategory = await prisma.categorys.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory || !id) {
      return res.status(400).json({
        status: false,
        message: "category id not exist",
        data: null,
      });
    }

    const updatedCategory = await prisma.categorys.update({
      where: { id: Number(id) },
      data: { categoryName },
    });

    if (!updatedCategory) {
      return res.status(400).json({
        status: false,
        message: "category code are required",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

const deletedCategory = async (req, res, next) => {
  try {
    let { id } = req.params;

    const existingCategory = await prisma.categorys.findUnique({
      where: { id: Number(id) },
      include: { class: true },
    });

    if (!existingCategory || !id) {
      return res.status(400).json({
        status: false,
        message: "category id not exist",
        data: null,
      });
    }

    const deletedCategory = await prisma.categorys.delete({
      where: { id: Number(id) },
      include: { class: { select: { classCode: true, className: true } } },
    });

    res.status(200).json({
      status: true,
      message: "category deleted successfully",
      data: deletedCategory,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategory,
  getByIdCategory,
  updateCategory,
  deletedCategory,
};
