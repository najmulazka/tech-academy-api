const otpGenerator = require('otp-generator')

module.exports = {
  generateOTP: () => {
    let otp = otpGenerator.generate(6, {upperCaseAlphabets: false, specialChars: false });

    return otp;
  },
};
