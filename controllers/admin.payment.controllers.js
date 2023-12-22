const prisma = require('../utils/libs/prisma.libs');

const getTransactionsAdmin = async (req, res, next) => {
  try {
    const usersWithTransactions = await prisma.transactions.findMany({
      include: {
        users: true,
        class: true,
      },
    });

    res.status(200).json({
      status: true,
      message: 'OK!',
      err: null,
      data: usersWithTransactions,
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
        message: 'Not Found',
        err: 'Transaction not found',
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

const validateTransaction = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { status } = req.body;

    if (!status) {
      return res.status(400).json({ status: false, message: 'Bad Request!', err: 'Status is require', data: null });
    }

    const transactionExist = await prisma.transactions.findUnique({ where: { id: Number(id) } });
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
        status: JSON.parse(status),
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

const deleteTransaction = async (req, res, next) => {
  try {
    let { id } = req.params;

    const existingTransaction = await prisma.transactions.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        status: false,
        message: 'Bad Request!',
        err: 'Transaction not found',
        data: null,
      });
    }

    await prisma.transactions.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      status: true,
      message: 'Transaction deleted successfully',
      err: null,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactionsAdmin,
  getDetailTransaction,
  validateTransaction,
  deleteTransaction,
};
