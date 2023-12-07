const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const validationEmail = (req, res, next) => {
  const email = req.body.email || req.query.email;

  if (!validateEmailFormat(email)) {
    return res.status(400).json({
      status: false,
      message: "Invalid email format",
      data: null,
    });
  }
  next();
};

module.exports = validationEmail;
