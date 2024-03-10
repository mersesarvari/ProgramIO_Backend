import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Email format check
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
Contains at least one lowercase letter.
Contains at least one uppercase letter.
Contains at least one digit.
Is at least 5 characters long.
*/
const passwordRegex: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{5,}$/;

interface IRegister extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ILogin extends Document {
  email: string;
  password: string;
}

const registerSchema = new Schema<IRegister>({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return emailRegex.test(value);
      },
      message: (props: any) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return passwordRegex.test(value);
      },
      message: (props: any) =>
        `Password must contain at least one lowercase letter, one uppercase letter, and one number and must be at least 5 characters long!`,
    },
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return value === this.password; // Check if confirmPassword matches the password
      },
      message: (props: any) => `Passwords do not match!`,
    },
  },
});

const loginSchema = new Schema<ILogin>({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return emailRegex.test(value);
      },
      message: (props: any) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const HashPassword = async (password: string) => {
  //Hashing the password
  const hashedPassword = await bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const Register = model<IRegister>("Register", registerSchema);
const Login = model<ILogin>("Login", loginSchema);

export { HashPassword, Register, Login, ILogin, IRegister };
