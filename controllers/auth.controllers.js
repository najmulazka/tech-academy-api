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

    const htmlOtp = await nodemailer.getHtml('welcome-message.ejs', {
      user: { fullName: user.fullName },
    });
    nodemailer.sendEmail(email, 'Welcome to TechAcademy', htmlOtp);

    return res.status(200).json({
      status: true,
      message: 'Activation Code verified successfully',
      err: null,
      data: { email, activationCode },
    });
  } catch (err) {
    next(err);
  }
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
        message: "Bad Request",
        error: "Token is required",
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

      return res.status(200).json({
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

    const encryptednew_password = await bcrypt.hash(new_password, 10);

    let user = await prisma.Users.update({
      where: { email },
      data: { password: encryptednew_password },
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

const resetPasswordRequest = async (req, res, next) => {
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

    const user = await prisma.Users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        error: 'User not found',
        data: null,
      });
    }

    // Generate a unique token for password reset
    const resetToken = generateResetToken();

    // Store the resetToken and expiration time in the database
    await prisma.Users.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(Date.now() + 3600000), // Set expiration time (1 hour)
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Send an email with the password reset link
    const htmlReset = await nodemailer.getHtml('reset-password.ejs', {
      user: { resetLink },
    });
    nodemailer.sendEmail(email, 'Password Reset Request', htmlReset);

    return res.status(200).json({
      status: true,
      message: 'Password reset email sent successfully',
      error: null,
      data: null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Email, newPassword, and resetToken are required',
        data: null,
      });
    }

    const user = await prisma.Users.findUnique({
      where: { email, resetPasswordToken: resetToken, resetPasswordExpires: { gte: new Date() } },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Invalid or expired reset token',
        data: null,
      });
    }

    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear resetToken fields
    await prisma.Users.update({
      where: { email },
      data: {
        password: encryptedNewPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    
    const confirmationHtml = `
      <html>
        <body>
          <h1>Password Reset Successful</h1>
          <p>Your password has been reset successfully. If you did not initiate this action, please contact us immediately.</p>
          <p>If you have any questions or concerns, feel free to reply to this email.</p>
          <p>Thank you for using our services!</p>
        </body>
      </html>
    `;

    nodemailer.sendEmail(email, 'Password Reset Successful', confirmationHtml);

    return res.status(200).json({
      status: true,
      message: 'Password reset successfully',
      error: null,
      data: null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


module.exports = {
  register,
  resendOTP,
  verifyOTP,
  login,
  changePassword,
  forrgotPassword,
  resendOtpPassword,
  verifyOtpForrgotPassword,
  resetPasswordRequest,
  resetPassword,
};
