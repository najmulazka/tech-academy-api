const prisma = require('../utils/libs/prisma.libs');
const imagekit = require('../utils/libs/imagekit.libs');
const path = require('path');

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

    if (!classExist.isFree) {
      await prisma.class.update({
        where: { classCode },
        data: { isFree: true },
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
    let { paymentMethod, bankId, cardNumber } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ status: false, message: 'Bad Request!', err: 'payment method is require', data: null });
    }

    const transactionExist = await prisma.transactions.findUnique({ where: { id: Number(id), userId: req.user.id } });
    if (!transactionExist) {
      return res.status(404).json({
        status: false,
        message: 'Bad Request!',
        err: 'Not Found',
        data: null,
      });
    }

    const transaction = await prisma.transactions.update({
      where: { id: Number(id) },
      data: {
        status: true,
        paymentMethod,
        bankId,
        cardNumber,
        createdAt: new Date(Date.now()),
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
      where: {
        OR: [
          { status: true, userId: req.user.id },
          { status: false, createdAt: { gte: new Date(Date.now() - 24 * 60 * 1000) }, userId: req.user.id },
        ],
      },
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
      where: { id: Number(id), userId: req.user.id },
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

module.exports = { createTransaction, getDetailTransaction, getTransactions, payment };
