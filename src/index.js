const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const eventApi = require("./Endpoints/eventAPI");
const authApi = require("./Endpoints/authAPI");
const { database } = require("./firebase.js");

const app = express();
const PORT = 3000;

//Applying JSON middleware
app.use(express.json());
//app.use(cors);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/event", eventApi);
app.use("/auth", authApi);

app.post("/event", (req, res) => {
  return res.send(req.body);
});

module.exports = { app };
