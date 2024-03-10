import mongoose, { Document } from "mongoose";

interface IEvent extends Document {
  name: string;
  description: string;
  longDescription: string;
  creationDate: string;
  userId: string;
  addressId: string;
}

const eventSchema = new mongoose.Schema<IEvent>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  creationDate: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  userId: { type: String, required: true },
  addressId: { type: String, required: true },
});

const Event = mongoose.model<IEvent>("Events", eventSchema);

export { Event, IEvent };
