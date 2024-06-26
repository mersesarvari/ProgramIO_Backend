import express from "express";
import cors from "cors";
import event from "./routes/event";
import user from "./routes/user";
import auth from "./routes/auth";
import image from "./routes/image";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

require("dotenv").config();

//MongoDB configuration
console.log("MongoURL", process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL);
const mongoDB = mongoose.connection;
mongoDB.on("error", (error) => console.error(error));
mongoDB.once("open", () => console.error("Connected to database"));

//Express configuration
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173"], // Specify the allowed origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "SetCookie"], // Specify the allowed headers
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/event", event);
app.use("/user", user);
app.use("/auth", auth);
app.use("/image", image);
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.URL}:${process.env.PORT}`);
});

export default app;
