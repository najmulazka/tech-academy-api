const prisma = require('../utils/libs/prisma.libs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  restrict: (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        err: 'missing token on header!',
        data: null,
      });
    }

    jwt.verify(authorization, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: err.message,
          data: null,
        });
      }

      req.user = await prisma.users.findUnique({ where: { email: decoded.email } });
      if (!req.user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'User does not exist',
          data: null,
        });
      }

      if (!req.user.isActivated) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: 'Your email is not activated',
          data: null,
        });
      }
      next();
    });
  },
};
