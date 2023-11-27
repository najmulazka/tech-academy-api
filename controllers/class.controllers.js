const prisma = require('../utils/libs/prisma.libs');

const createClass = async (req, res, next) => {
  try {
    let { className, description, price, isFree, levelName } = req.body;
    if (!className) {
      return res.status(400).json({ status: false, message: 'Bad Request', err: 'className is required', data: null });
    }
  } catch (err) {
    next(err);
  }
};
