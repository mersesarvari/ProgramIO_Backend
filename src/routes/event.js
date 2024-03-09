const express = require("express");
const router = express.Router();
const { eventSchema } = require("../models/eventModel.js");
const Event = require("../models/eventModel.js");

//Create
router.post("/", async (req, res) => {
  try {
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      longDescription: req.body.longDescription,
      creationDate: req.body.creationDate,
      userId: req.body.userId,
      addressId: req.body.addressId,
    });
    const newEvent = await event.save();
    //201 is the create code
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Get ALL
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//GET ONE
router.get("/:id", getEvent, async (req, res) => {
  res.send(res.event);
});
//UPDATE
router.patch("/:id", getEvent, async (req, res) => {
  try {
    if (req.body.name !== null) {
      res.event.name = req.body.name;
    }
    if (req.body.description !== null) {
      res.event.description = req.body.description;
    }
    if (req.body.longDescription !== null) {
      res.event.longDescription = req.body.longDescription;
    }
    if (req.body.creationDate !== null) {
      res.event.creationDate = req.body.creationDate;
    }
    if (req.body.userId !== null) {
      res.event.userId = req.body.userId;
    }
    if (req.body.addressId !== null) {
      res.event.addressId = req.body.addressId;
    }
    const updatedEvent = await res.event.save();
    res.json(updatedEvent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
//DELETE
router.delete("/:id", getEvent, async (req, res) => {
  try {
    await res.event.deleteOne();
    res.json({ message: "Deleted event!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getEvent(req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
    if (event === null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.event = event;
  next();
}

module.exports = router;
