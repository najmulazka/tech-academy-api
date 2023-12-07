const prisma = require('../utils/libs/prisma.libs'); 
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  isAdmin: (req, res, next) => {
    try {
      let { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: 'Authorization header missing',
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
        if (!req.user || !req.user.isAdmin) {
          return res.status(401).json({
            status: false,
            message: 'Unauthorized',
            err: 'You are not admin',
            data: null,
          });
        }
        next();
      });
    } catch (err) {
      next(err);
    }
  },
};
