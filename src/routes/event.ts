import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { IEvent, Event } from "../models/eventModel";
import { Authenticate } from "./auth";
import { User } from "../models/userModel";

// Create
router.post("/", Authenticate, async (req: Request, res: Response) => {
  try {
    //Getting the user informations:
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    const event: IEvent = new Event({
      name: req.body.name,
      description: req.body.description,
      longDescription: req.body.longDescription,
      creationDate: req.body.creationDate,
      userId: req.body.userId,
      address: req.body.address,
      date: req.body.date,
      eventType: req.body.eventType,
      rating: req.body.rating,
      title: req.body.title,
    });
    const newEvent = await event.save();
    // 201 is the create code
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get ALL
router.get("/", async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE
router.get("/:id", getEvent, async (req: Request, res: Response) => {
  res.send(res.locals.event);
});

// UPDATE
router.patch("/:id", getEvent, async (req: Request, res: Response) => {
  try {
    if (req.body.name !== null) {
      res.locals.event.name = req.body.name;
    }
    if (req.body.description !== null) {
      res.locals.event.description = req.body.description;
    }
    if (req.body.longDescription !== null) {
      res.locals.event.longDescription = req.body.longDescription;
    }
    if (req.body.creationDate !== null) {
      res.locals.event.creationDate = req.body.creationDate;
    }
    if (req.body.userId !== null) {
      res.locals.event.userId = req.body.userId;
    }
    if (req.body.addressId !== null) {
      res.locals.event.addressId = req.body.addressId;
    }
    const updatedEvent = await res.locals.event.save();
    res.json(updatedEvent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", getEvent, async (req: Request, res: Response) => {
  try {
    await res.locals.event.deleteOne();
    res.json({ message: "Deleted event!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await Event.findById(req.params.id);
    if (event === null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
    res.locals.event = event;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default router;
