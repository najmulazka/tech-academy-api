const prisma = require("../utils/libs/prisma.libs");

const createCategory = async (req, res, next) => {
  try {
    let { categoryName } = req.body;
    const newCategory = await prisma.categorys.create({
      data: { categoryName },
    });
    return res.status(201).json({
      status: true,
      message: "created successfully",
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const categories = await prisma.categorys.findMany();
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
    let { categoryName } = req.body;

    const idCategory = await prisma.categorys.update({
      where: { id: Number(id) },
      data: { categoryName },
    });

    return res.status(200).json({
      status: true,
      message: "getById category successfully",
      data: idCategory,
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { categoryName } = req.body;

    const updatedCategory = await prisma.categorys.update({
      where: { id: Number(id) },
      data: { categoryName },
    });

    return res.status(200).json({
      status: true,
      message: "category updated successfully",
      data: updatedCategory,
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
};
