import Joi from "joi";

const registerValidationSchema = Joi.object({
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

const loginValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export { registerValidationSchema, loginValidationSchema };
