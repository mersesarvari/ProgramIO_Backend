const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const event = require("./routes/event.js");
const user = require("./routes/user.js");
const auth = require("./routes/auth.js");
const mongoose = require("mongoose");
require("dotenv").config();

//MongoDB configuration
console.log("MongoURL", process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL);
const mongoDB = mongoose.connection;
mongoDB.on("error", (error) => console.error(error));
mongoDB.once("open", () => console.error("Connected to database"));

//Express configuration
const app = express();

app.use(express.json());
app.use("/event", event);
app.use("/user", user);
app.use("/auth", auth);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.URL}:${process.env.PORT}`);
});

module.exports = { app };
