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

const getTransactionsAdmin = async (req, res, next) => {
  try {
    const classExist = await prisma.transactions.findMany();

    res.status(200).json({
      status: true,
      message: 'OK!',
      err: null,
      data: classExist,
    });
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const classExist = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: { transactions: { include: { class: true } } },
    });

    res.status(200).json({
      status: true,
      message: 'OK!',
      err: null,
      data: classExist,
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
      include: { class: true, users: true },
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

module.exports = { createTransaction, getTransactionsAdmin, getDetailTransaction, getTransactions };
