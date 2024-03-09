import { Schema, model } from "mongoose";

// Email format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
Contains at least one lowercase letter.
Contains at least one uppercase letter.
Contains at least one digit.
Is at least 5 characters long.
*/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{5,}$/;

const registerSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return passwordRegex.test(value);
      },
      message: (props) =>
        `Password must contain at least one lowercase letter, one uppercase letter, and one number and must be at least 5 characters long!`,
    },
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === this.password; // Check if confirmPassword matches the password
      },
      message: (props) => `Passwords do not match!`,
    },
  },
});

const loginSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

export const Register = model("Register", registerSchema);
export const Login = model("Login", loginSchema);
