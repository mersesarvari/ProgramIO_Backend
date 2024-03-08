const express = require("express");
const router = express.Router();

const {
  CreateUser,
  registerSchema,
  loginSchema,
} = require("../models/authModel.js");
const {
  create,
  getAll,
  remove,
  update,
  getOne,
  login,
  database,
} = require("../firebase.js");

const users = [];

//Registration
router.post("/register", async (req, res) => {
  try {
    const result = registerSchema.validate(req.body);

    if (result.error) {
      return res.status(400).send(result.error);
    } else {
      const newUser = CreateUser(
        req.body.username,
        req.body.email,
        req.body.password
      );
      //Checking if the user with that email alreay exists or not:
      const citiesRef = database.collection("user");
      const snapshot = await citiesRef
        .where("email", "==", newUser.email)
        .get();
      if (!snapshot.empty) {
        throw new Error("Email address is already taken!");
      }
      //Uploading user to the server
      var results = await create("/user", newUser);
      return res.status(200).send(newUser);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const result = loginSchema.validate(req.body);

    if (result.error) {
      return res.status(400).send("Please enter both email and password!");
    } else {
      const loginUser = {
        email: req.body.email,
        password: req.body.password,
      };

      const users = await getAll("/user"); // Assuming "/user" is the path to your user collection
      console.log("users", users);
      // Check if there is a user with the provided email and password
      const user = await users.find(
        (user) =>
          user.email === loginUser.email && user.password === loginUser.password
      );
      //if there is no user, then throw an error
      if (!user) {
        throw new Error(
          "Invalid email or password or account does not exists!"
        );
      }
      return res.status(200).send(user);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
