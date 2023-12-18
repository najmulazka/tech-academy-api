const prisma = require('../utils/libs/prisma.libs');

module.exports = {
  createBank: async (req, res, next) => {
    try {
      let { bankType, bankNumber } = req.body;
      if (!bankType) {
        return res.status(400).json({ status: false, message: 'Bad Request', err: 'bank type is required', data: null });
      }

      let bank = await prisma.Bank.create({
        data: {
          bankType,
          bankNumber,
        },
      });

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  banks: async (req, res, next) => {
    try {
      let bank = await prisma.Bank.findMany();

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  bankDetail: async (req, res, next) => {
    try {
      let { id } = req.params;

      const bank = await prisma.Bank.findUnique({
        where: { id: Number(id) },
      });

      if (!bank) {
        return res.status(404).json({ status: false, message: 'Not found', err: null, data: null });
      }

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  updateBank: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { bankType, bankNumber } = req.body;
      if (!bankType) {
        return res.status(400).json({ status: false, message: 'Bad Request', err: 'bank type is required', data: null });
      }

      const existBank = await prisma.Bank.findUnique({
        where: { id: Number(id) },
      });

      if (!existBank) {
        return res.status(404).json({ status: false, message: 'Not found', err: null, data: null });
      }

      const bank = await prisma.Bank.update({
        where: { id: Number(id) },
        data: {
          bankType,
          bankNumber,
        },
      });

      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: bank,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteBank: async (req, res, next) => {
    try {
      let { id } = req.params;

      const existBank = await prisma.Bank.findUnique({
        where: { id: Number(id) },
      });

      if (!existBank) {
        return res.status(404).json({ status: false, message: 'Not found', err: null, data: null });
      }

      const bank = await prisma.Bank.delete({
        where: { id: Number(id) },
      });

      res.status(204).json();
    } catch (err) {
      next(err);
    }
  },
};
