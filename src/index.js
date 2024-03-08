const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const eventApi = require("./event/eventAPI");
const authApi = require("./event/authAPI");
const { database } = require("./firebase.js");
const authentication = require("../src/authentication/authentication");

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

authentication.Setup(
  app,
  "E:\\Munka\\Nazmox\\ProgramIO\\firebase-creds.json",
  "https://nightworkstest-default-rtdb.europe-west1.firebasedatabase.app"
);

app.post("/event", (req, res) => {
  return res.send(req.body);
});

module.exports = { app };
