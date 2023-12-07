const prisma = require("../utils/libs/prisma.libs");
const imagekit = require('../utils/libs/imagekit.libs');
const path = require('path');
const { getPagination } = require("../utils/libs/pagination.libs");

const getAllUsers = async (req, res, next) => {
  try {
    let { limit = 2, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);
    let users = await prisma.users.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        id: "asc",
      },
    });
    const { _count } = await prisma.users.aggregate({
      _count: { id: true },
    });

    let pagination = getPagination(req, _count.id, page, limit);

    res.status(201).json({
      status: true,
      message: "All Users Data",
      data: { pagination, users },
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      status: true,
      message: "User Found",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const {
        fullName,
        noTelp,
        city,
        country,
        profilePicture,
        fileId,
        isActivated, 
        isAdmin
      } = req.body;
  
      const existingUser = await prisma.users.findUnique({
        where: { id: userId },
      });
  
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      let updatedProfilePicture = profilePicture;
      let updatedFileId = fileId;
  
      if (req.file) {
        const strFile = req.file.buffer.toString("base64");
        const { url, fileId: imageFileId } = await imagekit.upload({
          fileName: Date.now() + path.extname(req.file.originalname),
          file: strFile,
        });
  
        updatedProfilePicture = url;
        updatedFileId = imageFileId;
      }
  
      const user = await prisma.users.update({
        where: { id: userId },
        data: {
          fullName,
          noTelp,
          city,
          country,
          profilePicture: updatedProfilePicture,
          fileId: updatedFileId,
          isActivated: JSON.parse(isActivated),
          isAdmin: JSON.parse(isAdmin)
        },
      });
  
      res
        .status(200)
        .json({ success: true, message: "User berhasil diperbarui", data: user });
    } catch (error) {
      next(error);
    }
  };
  

const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.users.delete({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        error: null,
        data: null,
      });
    }
    return res.status(200).json({
      status: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
