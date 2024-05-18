// routes/auth.js
const Joi = require("joi");

const registerValidationSchema = Joi.object({
  user: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const loginValidationSchema = Joi.object({
  user: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
};
