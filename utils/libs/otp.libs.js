module.exports = {
  generateOTP: () => {
    const otpLength = 6;
    const otpChars = "123456789";
    let otp = "";

    for (let i = 0; i < otpLength; i += 1) {
      otp += otpChars[Math.floor(Math.random() * otpChars.length)];
    }

    return otp;
  },
};
