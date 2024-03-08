const { v4: guid } = require("uuid");
const Joi = require("joi");

const CreateUser = (username, email, password) => {
  return {
    id: guid(),
    username: username,
    email: email,
    password: password,
    registrationDate: new Date(),
    activationDate: null,
    activated: false,
    role: 0,
  };
};
const registerSchema = Joi.object({
  username: Joi.string().max(50).min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(5)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]+$"))
    .message(
      "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, and one number."
    ),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { CreateUser, registerSchema, loginSchema };
