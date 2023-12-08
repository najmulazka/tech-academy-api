const prisma = require('../utils/libs/prisma.libs');

const createTransaction = async (req, res, next) => {
  try {
    let { classCode } = req.params;

    const classExist = await prisma.class.findUnique({ where: { classCode } });
    if (!classExist) {
      return res.status(404).json({
        status: false,
        message: 'Bad Request!',
        err: 'Not Found',
        data: null,
      });
    }

    const transaction = await prisma.transactions.create({
      data: {
        userId: req.user.id,
        classCode,
      },
    });

    res.status(200).json({
      status: true,
      message: 'OK!',
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
      message: 'OK!',
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
        message: 'Bad Request!',
        err: 'Not Found',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'OK!',
      err: null,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

const payment = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { paymentMethod } = req.body;

    const transaction = await prisma.transactions.findUnique({
      where: { id: Number(id) },
      include: { users: true, class: true },
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: 'Bad Request!',
        err: 'Not Found',
        data: null,
      });
    }

    let update = await prisma.transactions.update({
      where: {
        id,
        status: true,
        paymentDate: new Date(Date.now(), paymentMethod),
      },
    });

    res.status(200).json({
      status: true,
      message: 'Payment success',
      err: null,
      data: update,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTransaction, getDetailTransaction, getTransactions, payment };
