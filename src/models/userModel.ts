const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
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
  password: { type: String, required: true },
  creationDate: { type: String, required: true, default: Date.now() },
  activationDate: { type: String, required: false },
  activated: { type: Boolean, required: true, default: false },
});

export default mongoose.model("Users", userSchema);
