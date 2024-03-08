const express = require("express");
const authentication = require("./authentication");
const router = express.Router();

router.post("/register", async (req, res) => {
  authentication.register(req.body.username, req.body.email, req.body.password);
});

router.post("/login", async (req, res) => {
  authentication.login(req.body.email, req.body.password);
});

module.exports = router;
