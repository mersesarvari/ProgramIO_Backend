import mongoose, { Document } from "mongoose";
import Address from "./addressModel";

interface IEvent extends Document {
  title: string;
  name: string;
  description: string;
  longDescription: string;
  creationDate: string;
  userId: string;
  rating: number;
  address: Address;
  eventType: number;
  date: Date;
}

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  coordinate: {
    ltd: number;
    lng: number;
  };
};

const eventSchema = new mongoose.Schema<IEvent>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  creationDate: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  userId: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number, required: true },
    country: { type: String, required: true },
    coordinate: {
      ltd: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  date: { type: Date, required: true },
  //Types. OneTime=0, Reoccuring=1, AllDay=2
  eventType: { type: Number, required: true },
});

const Event = mongoose.model<IEvent>("Events", eventSchema);

export { Event, IEvent };
