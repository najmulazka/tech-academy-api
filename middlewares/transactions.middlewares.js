const prisma = require('../utils/libs/prisma.libs');

module.exports = {
  transaction: async (req, res, next) => {
    try {
      let { classCode } = req.params;

      req.class = await prisma.class.findUnique({ where: { classCode } });
      if (req.class.isFree) {
        return res.status(400).json({
          status: true,
          message: 'Bad Request!',
          err: 'Class is free',
          data: null,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  },
};
