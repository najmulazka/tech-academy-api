const prisma = require('../utils/libs/prisma.libs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const { generateOTP } = require('../utils/libs/otp.libs');
const nodemailer = require('../utils/libs/nodemailer.libs');

const register = async (req, res, next) => {
  try {
    const { namaLengkap, email, noTelp, password } = req.body;
    const otp = generateOTP();

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email is required',
        data: null,
      });
    }

    let userExist = await prisma.user.findUnique({ where: { email } });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'user has already been used!',
        data: null,
      });
    }

    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = await prisma.user.create({
      data: {
        namaLengkap,
        email,
        noTelp,
        password: encryptedPassword,
        otp,
      },
    });

    let token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);
    const htmlOtp = await nodemailer.getHtml('otp-message.ejs', {
      user: { otp },
    });
    nodemailer.sendEmail(email, 'OTP Verification', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'Created',
      err: null,
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email is required',
        data: null,
      });
    }

    let userExist = await prisma.user.findUnique({ where: { email } });
    if (!userExist) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        err: 'User not found',
        data: null,
      });
    }

    const otp = generateOTP();
    let user = await prisma.user.update({
      where: { email },
      data: { otp },
    });

    const htmlOtp = await nodemailer.getHtml('otp-message.ejs', {
      user: { otp },
    });
    nodemailer.sendEmail(email, 'OTP Verification', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'OTP resent successfully',
      err: null,
      data: { otp },
    });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { namaLengkap, email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email and OTP are required',
        data: null,
      });
    }

    let userExist = await prisma.user.findUnique({ where: { email } });
    if (!userExist) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        err: 'User not found',
        data: null,
      });
    }

    if (userExist.otp !== otp) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Invalid OTP',
        data: null,
      });
    }

    let user = await prisma.user.update({
      where: { email },
      data: { otp: null },
    });

    const htmlOtp = await nodemailer.getHtml('welcome-message.ejs', {
      namaLengkap,
    });
    nodemailer.sendEmail(email, 'Berhasil', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'OTP verified successfully',
      err: null,
      data: { email },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
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
};

const changePassword = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword, repeatNewPassword } = req.body;

    if (!email || !currentPassword || !newPassword || !repeatNewPassword) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email, currentPassword, newPassword, and repeatNewPassword are required',
        data: null,
      });
    }

    if (newPassword !== repeatNewPassword) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'New password and repeat password do not match',
        data: null,
      });
    }

    const userExist = await prisma.user.findUnique({ where: { email } });

    if (!userExist) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        err: 'User not found',
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, userExist.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        err: 'Invalid current password',
        data: null,
      });
    }

    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);

    let user = await prisma.user.update({
      where: { email },
      data: { password: encryptedNewPassword },
    });

    const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);

    return res.status(200).json({
      status: true,
      message: 'Password changed successfully',
      err: null,
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  resendOTP,
  verifyOTP,
  login,
  changePassword,
};
