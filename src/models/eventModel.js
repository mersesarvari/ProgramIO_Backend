const mongoose = require("mongoose");

const eventShema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  creationDate: { type: String, required: true, default: Date.now() },
  userId: { type: String, required: true },
  addressId: { type: String, required: true },
});

module.exports = mongoose.model("Events", eventShema);
