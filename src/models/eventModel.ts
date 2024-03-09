import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  creationDate: { type: String, required: true, default: Date.now() },
  userId: { type: String, required: true },
  addressId: { type: String, required: true },
});

export default mongoose.model("Events", eventSchema);
