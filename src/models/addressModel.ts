import mongoose, { Document } from "mongoose";

export interface IAddress extends Document {
  name: string;
  country: string;
  city: string;
  zipcode: number;
  street: string;
  houseNumber: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const addressSchema = new mongoose.Schema<IAddress>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: Number, required: true },
  street: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

const Address = mongoose.model<IAddress>("Addresses", addressSchema);

export default Address;
