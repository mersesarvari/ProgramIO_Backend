import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { IEvent, Event } from "../models/eventModel";
import { Authenticate } from "./auth";
import { User } from "../models/userModel";
import multer from "multer";

// Create
router.post("/", Authenticate, async (req: Request, res: Response) => {
  try {
    //Getting the user informations:
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).json({ message: "User not found" });

    //Creating the event
    console.log("Event:", req.body);
    // Access form data and uploaded images
    const { name, description, long_description, date, address, type } =
      req.body;
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const event: IEvent = new Event({
      name,
      description,
      long_description,
      date,
      userId: user._id.toString(),
      address,
      type,
      images,
    });
    const newEvent = await event.save();
    // 201 is the create code
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/new-image", Authenticate, async (req: Request, res: Response) => {
  try {
    //Getting the user informations:
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const currentEvent = await Event.findById(req.params.id);
    if (!currentEvent)
      return res.status(404).json({ message: "Event not found" });
    //Image validation is still nessecary
    const oldImages = currentEvent.images;
    oldImages.push(...images);
    const newEvent = await currentEvent.save();
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

// Get Events By user
router.get("/my-events", Authenticate, async (req: Request, res: Response) => {
  try {
    //Getting the user informations:
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const events = await Event.find({ userId: user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "[Server]: " + error.message });
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
