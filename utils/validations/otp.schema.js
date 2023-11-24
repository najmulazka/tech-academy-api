const Joi = require("joi");

const otpValidationSchema = Joi.object({
  otp: Joi.number().integer().min(100000).max(999999).required().messages({
    "number.base": "OTP must be a number",
    "number.integer": "OTP must be an integer",
    "number.min": "OTP must be at least 6 digits",
    "number.max": "OTP must be up to 6 digits",
    "any.required": "OTP is required",
  }),
  verifiedToken: Joi.string().optional().messages({
    "string.base": "verifiedToken must be a string",
  }),
});

module.exports = otpValidationSchema;
