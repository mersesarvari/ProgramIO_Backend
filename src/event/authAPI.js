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
} = require("../firebase");

const users = [];

//Registration
router.post("/register", async (req, res) => {
  const result = registerSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  } else {
    const newUser = CreateUser(
      req.body.username,
      req.body.email,
      req.body.password
    );

    console.log("New user?", newUser);
    await create("/user", newUser);
    return res.status(200).send(result.value);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const result = loginSchema.validate(req.body);

    if (result.error) {
      return res.status(400).send("You must enter a valid email and password!");
    } else {
      const loginUser = {
        email: req.body.email,
        password: req.body.password,
      };
      console.log("Login User", loginUser);
      await login(loginUser);
      return res.status(200).send(result);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
