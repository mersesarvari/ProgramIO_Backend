import mongoose, { Document } from "mongoose";
import Address from "./addressModel";

interface IEvent extends Document {
  name: string;
  description: string;
  long_description: string;
  userId: string;
  rating: number;
  address: Address;
  type: String;
  date: Date;
  create_date: Date;
}

type Address = {
  formatted_address: string;
  route: string;
  street_number: string;
  city: string;
  state: string;
  postal: number;
  country: string;
  coordinate: {
    lat: number;
    lng: number;
  };
};

const eventSchema = new mongoose.Schema<IEvent>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  long_description: { type: String, required: true },
  userId: { type: String, required: true },
  address: {
    formatted_address: { type: String, required: true },
    route: { type: String, required: true },
    street_number: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal: { type: Number, required: true },
    country: { type: String, required: true },
    coordinate: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  date: { type: Date, required: true },
  create_date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  //Types. OneTime=0, Reoccuring=1, AllDay=2
  type: { type: String, required: true },
});

const Event = mongoose.model<IEvent>("Events", eventSchema);

export { Event, IEvent };
