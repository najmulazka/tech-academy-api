const prisma = require("../utils/libs/prisma.libs");
const imagekit = require("../utils/libs/imagekit.libs");
const path = require("path");

const getUserById = async (req, res, next) => {
  try {
    const user = req.user;

    const userResponse = {
      fullName: user.fullName,
      email: user.email,
      noTelp: user.noTelp,
      city: user.city,
      country: user.country,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      status: true,
      message: "User Found",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = req.user;

    const userId = user.id;
    const { fullName, noTelp, city, country, profilePicture } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let updatedProfilePicture = profilePicture;
    let fileId;

    if (req.file) {
      const strFile = req.file.buffer.toString("base64");
      const { url: imageUrl, fileId: imageFileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      updatedProfilePicture = imageUrl;
      fileId = imageFileId;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        fullName,
        noTelp,
        city,
        country,
        profilePicture: updatedProfilePicture,
        fileId: fileId,
      },
    });

    res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = req.user;
    const deletedUser = await prisma.users.delete({
      where: {
        id: user.id,
      },
    });

    if (!deletedUser) {
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
  getUserById,
  updateUser,
  deleteUser,
};
