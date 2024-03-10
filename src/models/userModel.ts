import mongoose, { Document } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  creationDate: string;
  activationDate?: string;
  activated: boolean;
  role: number;
  refreshTokens: String[];
}

const userSchema = new mongoose.Schema<IUser>({
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
  password: { type: String, required: true },
  creationDate: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  refreshTokens: [],
  activationDate: { type: String, required: false },
  activated: { type: Boolean, required: true, default: false },
  role: { type: Number, required: true, default: 0 },
});

const User = mongoose.model<IUser>("Users", userSchema);

export { User, IUser };
