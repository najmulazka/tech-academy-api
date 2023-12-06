const prisma = require("../utils/libs/prisma.libs");

const createNotification = async (req, res, next) => {
  try {
    const { title, body, deskripsi, userId } = req.body;

    if (!title || !body || !userId) {
      return res.status(400).json({
        status: false,
        message: "Title, body, and userId are required for creating a notification",
        data: null,
      });
    }

    const existingUser = await prisma.users.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
      return res.status(400).json({
        status: false,
        message: "User with the provided userId does not exist",
        data: null,
      });
    }

    const newNotification = await prisma.notifications.create({
        data: { title, body, deskripsi, userId },
    });

    res.status(200).json({
      status: true,
      message: "Notification created successfully",
      data: newNotification,
    });
    } catch (err) {
        next(err);
    }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notifications.findMany();
    res.status(200).json(notifications);
  } catch (err) {
    next (err);
  }
};

const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notifications.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!notification) {
      return res.status(404).json({
        status: false,
        message: "Notification not found",
        data: null,
      });
    }

    res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
};


const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body, deskripsi, userId } = req.body;

    if (!title || !body || !userId) {
      return res.status(400).json({
        status: false,
        message: "Title, body, and userId are required for updating a notification",
        data: null,
      });
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(400).json({
        status: false,
        message: "User with the provided userId does not exist",
        data: null,
      });
    }

    const updatedNotification = await prisma.notifications.update({
      where: { id: parseInt(id, 10) },
      data: { title, body, deskripsi, userId },
    });

    res.status(200).json({
      status: true,
      message: "Notification updated successfully",
      data: updatedNotification,
    });
  } catch (err) {
    next (err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.notifications.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (err) {
    next (err);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
