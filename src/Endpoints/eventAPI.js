const express = require("express");
const router = express.Router();
const { eventSchema } = require("../models/eventModel.js");
const { create, getAll, remove, update, getOne } = require("../firebase.js");

const events = [];

router.post("/", async (req, res) => {
  const result = eventSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    return res.status(400).send(result.error);
  } else {
    await create("/event", req.body);
    return res.status(200).send(result.value);
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await getAll("/event");
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const data = await getOne("/event/", req.params.id);
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const result = eventSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      return res.status(400).send(result.error);
    } else {
      await update("/event", req.params.id, req.body);
      return res.status(200).send(result.value);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    console.log("Delete method called");
    await remove("/event", req.params.id);
    return res.status(200).send(result.value);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
