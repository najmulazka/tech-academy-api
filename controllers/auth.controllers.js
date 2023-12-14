const prisma = require('../utils/libs/prisma.libs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const { generateOTP } = require('../utils/libs/otp.libs');
const nodemailer = require('../utils/libs/nodemailer.libs');

const register = async (req, res, next) => {
  try {
    const { fullName, email, noTelp, password } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email is required',
        data: null,
      });
    }

    let userExist = await prisma.users.findUnique({ where: { email } });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'user has already been used!',
        data: null,
      });
    }

    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = await prisma.users.create({
      data: {
        fullName,
        email,
        noTelp,
        password: encryptedPassword,
      },
    });

    const otp = generateOTP();
    await prisma.activationCodes.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        activationCode: otp,
        createdAt: new Date(),
      },
      update: {
        activationCode: otp,
        createdAt: new Date(),
      },
    });

    let token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);
    const htmlOtp = await nodemailer.getHtml('otp-message.ejs', {
      user: { activationCode: otp },
    });
    nodemailer.sendEmail(email, 'Activation Code Verification', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'Created',
      err: null,
      data: { fullName, email, noTelp, password, token },
    });
  } catch (err) {
    next(err);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Token is required',
        data: null,
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const { email } = decodedToken;
    let user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        err: 'User not found',
        data: null,
      });
    }

    const otp = generateOTP();
    await prisma.activationCodes.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        activationCode: otp,
        createdAt: new Date(),
      },
      update: {
        activationCode: otp,
        createdAt: new Date(),
      },
    });

    await prisma.activationCodes.findFirst({
      where: { userId: user.id },
    });

    const htmlOtp = await nodemailer.getHtml('otp-message.ejs', {
      user: { activationCode: otp },
    });
    nodemailer.sendEmail(email, 'Activation Code Resent', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'OTP resent successfully',
      err: null,
      data: { email, token },
    });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, activationCode } = req.body;

    if (!email || !activationCode) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email and OTP are required',
        data: null,
      });
    }

    let user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        err: 'User not found',
        data: null,
      });
    }

    let userActivationCode = await prisma.activationCodes.findFirst({
      where: {
        userId: user.id,
        activationCode,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    });

    if (!userActivationCode) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Invalid Activation Code or Code Expired',
        data: null,
      });
    }

    await prisma.activationCodes.delete({
      where: { userId: user.id },
    });

    await prisma.users.update({
      where: { id: user.id },
      data: {
        isActivated: true,
      },
    });

    const htmlOtp = await nodemailer.getHtml('welcome-message.ejs', {
      user: { fullName: user.fullName },
    });
    nodemailer.sendEmail(email, 'Welcome to TechAcademy', htmlOtp);

    await prisma.notifications.create({
      data: {
        title: 'Account Activation',
        body: 'Account activation successful',
        userId: user.id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Activation Code verified successfully',
      err: null,
      data: { email, activationCode },
    });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  let { email, password } = req.body;

  const existAdmin = await prisma.users.findUnique({ where: { email } });

  if (!existAdmin) {
    return res.status(400).json({
      status: false,
      message: 'Bad Request',
      err: 'Email or password does not exist',
      data: null,
    });
  }

  if (!existAdmin.isAdmin) {
    return res.status(400).json({
      status: false,
      message: 'Bad Request!',
      err: 'You are not admin',
      data: null,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, existAdmin.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: false,
      message: 'Bad Request',
      err: 'Email or password does not exist',
      data: null,
    });
  }

  let token = await jwt.sign({ email: existAdmin.email }, JWT_SECRET_KEY);
  res.status(200).json({
    status: true,
    message: 'OK',
    err: null,
    data: { existAdmin, token },
  });
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    const user = await prisma.Users.findUnique({ where: { email } });
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

    if (!user.isActivated) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'You are not activated',
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

const forrgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email  are required',
        data: null,
      });
    }

    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request!',
        err: 'User does not exist',
        data: null,
      });
    }

    const otp = generateOTP();
    await prisma.resetCodes.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        resetCode: otp,
        createdAt: new Date(Date.now()),
      },
      update: {
        resetCode: otp,
        createdAt: new Date(Date.now()),
      },
    });

    let token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);

    const htmlOtp = await nodemailer.getHtml('forrgot-password.ejs', {
      otp,
      fullName: user.fullName,
    });
    nodemailer.sendEmail(email, 'Lupa Password', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'OK!',
      err: null,
      data: { user, otp, token },
    });
  } catch (err) {
    next(err);
  }
};

const resendOtpPassword = async (req, res, next) => {
  try {
    let { token } = req.query;
    if (!token) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Token is required',
        data: null,
      });
    }

    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: err.message,
          data: null,
        });
      }

      console.log(decoded);

      let user = await prisma.Users.findUnique({
        where: { email: decoded.email },
      });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'User does not exist',
          data: null,
        });
      }

      const otp = generateOTP();
      let updateResetCode = await prisma.resetCodes.update({
        where: { userId: user.id },
        data: {
          resetCode: otp,
          createdAt: new Date(Date.now()),
        },
      });

      const htmlOtp = await nodemailer.getHtml('forrgot-password.ejs', {
        otp,
        fullName: user.fullName,
      });
      nodemailer.sendEmail(decoded.email, 'Lupa Password', htmlOtp);

      return res.status(200).json({
        status: true,
        message: 'resend OTP forrgot password resent successfully',
        err: null,
        data: { user, otp },
      });
    });
  } catch (err) {
    next(err);
  }
};

const verifyOtpForrgotPassword = async (req, res, next) => {
  try {
    const { otp } = req.body;
    let { token } = req.query;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Token is required',
        data: null,
      });
    }

    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: err.message,
          data: null,
        });
      }

      if (!otp) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'OTP are required',
          data: null,
        });
      }

      let user = await prisma.Users.findUnique({
        where: { email: decoded.email },
      });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: 'User does not exist',
          data: null,
        });
      }

      let result = await prisma.resetCodes.findFirst({
        where: {
          userId: user.id,
          resetCode: otp,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000), // Valid selama 5 menit
          },
        },
      });

      if (!result) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Invalid OTP',
          data: null,
        });
      }

      await prisma.resetCodes.delete({
        where: { userId: user.id },
      });

      await prisma.notifications.create({
        data: {
          title: 'Password Reset',
          body: 'Password reset was successful',
          userId: user.id,
        },
      });

      res.status(200).json({
        status: true,
        message: 'OTP verified password successfully',
        err: null,
        data: { user },
      });
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { newPassword, newPasswordConfirmation } = req.body;
    let { token } = req.query;

    if (!newPassword || !newPasswordConfirmation) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'newPassword and newPasswordConfirmation are required',
        data: null,
      });
    }

    if (newPassword !== newPasswordConfirmation) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'new password and new password confirmation not same',
        data: null,
      });
    }

    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: err.message,
          data: null,
        });
      }

      let existUser = await prisma.Users.findUnique({
        where: { email: decoded.email },
      });
      if (!existUser) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: 'User does not exist',
          data: null,
        });
      }

      const encryptedNewPassword = await bcrypt.hash(newPassword, 10);
      const user = await prisma.users.update({
        where: { email: existUser.email },
        data: {
          password: encryptedNewPassword,
        },
      });

      const resetPasswordSucces = await nodemailer.getHtml('reset-password-success.ejs', {
        fullName: user.fullName,
      });
      nodemailer.sendEmail(user.email, 'Reset Password Success', resetPasswordSucces);

      return res.status(200).json({
        status: true,
        message: 'Reset password success',
        err: null,
        data: null,
      });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { email, currentPassword, new_password, new_password_confirm } = req.body;

    if (!email || !currentPassword || !new_password || !new_password_confirm) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email, currentPassword, new_password, and new_password_confirm are required',
        data: null,
      });
    }

    if (new_password !== new_password_confirm) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'New password and repeat password do not match',
        data: null,
      });
    }

    const userExist = await prisma.Users.findUnique({ where: { email } });

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

    const encryptedNewPassword = await bcrypt.hash(new_password, 10);

    let user = await prisma.Users.update({
      where: { email },
      data: { password: encryptedNewPassword },
    });

    await prisma.notifications.create({
      data: {
        title: 'Change Password',
        body: 'Successfully changed the password',
        userId: user.id,
      },
    });

    const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);

    return res.status(200).json({
      status: true,
      message: 'Password changed successfully',
      err: null,
      data: {
        email,
        currentPassword,
        new_password,
        new_password_confirm,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  resendOTP,
  verifyOTP,
  loginAdmin,
  login,
  changePassword,
  forrgotPassword,
  resendOtpPassword,
  verifyOtpForrgotPassword,
  resetPassword,
};
