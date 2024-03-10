import mongoose, { Document } from "mongoose";

interface IRefreshToken extends Document {
  value: string;
  address: string;
  port: number;
  active: boolean;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  value: { type: String, required: true },
  address: { type: String, required: true },
  port: { type: Number, required: true },
  active: { type: Boolean, required: true, default: true },
});

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshTokens",
  refreshTokenSchema
);

export { RefreshToken, IRefreshToken, refreshTokenSchema };
