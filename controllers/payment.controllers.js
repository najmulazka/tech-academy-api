const prisma = require("../utils/libs/prisma.libs");

const createTransaction = async (req, res, next) => {
  try {
    let { classCode } = req.params;
    let { paymentMethod, cardNumber } = req.body;

    const classExist = await prisma.class.findUnique({ where: { classCode } });
    if (!classExist) {
      return res.status(404).json({
        status: false,
        message: "Bad Request!",
        err: "Not Found",
        data: null,
      });
    }

    const transaction = await prisma.transactions.create({
      data: {
        userId: req.user.id,
        paymentMethod,
        cardNumber,
        classCode,
      },
    });

    if (!classExist.isFree) {
      await prisma.class.update({
        where: { classCode },
        data: { isFree: true },
      });
    }

    res.status(200).json({
      status: true,
      message: "OK!",
      err: null,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    // Pengguna biasa melihat pembayarannya sendiri
    const userTransactions = await prisma.transactions.findMany({
      where: { userId: req.user.id },
      include: { class: true },
    });

    res.status(200).json({
      status: true,
      message: "OK!",
      data: userTransactions,
    });
  } catch (err) {
    next(err);
  }
};

const getDetailTransaction = async (req, res, next) => {
  try {
    let { id } = req.params;

    const transaction = await prisma.transactions.findUnique({
      where: { id: Number(id) },
      include: { users: true, class: true },
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Bad Request!",
        err: "Not Found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "OK!",
      err: null,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTransaction, getDetailTransaction, getTransactions };
