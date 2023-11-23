const prisma = require('../utils/libs/prisma.libs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Email atau password salah',
          data: null,
        });
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Email atau password salah',
          data: null,
        });
      }

      let token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);
      res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  },
};
