import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { IEvent, Event } from "../models/eventModel";
import { Authenticate } from "./auth";
import { User } from "../models/userModel";
import multer from "multer";
import fs from "fs";
import path from "path";

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads"); // Destination directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Keep the original filename
  },
});
const upload = multer({ storage });

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

router.post(
  "/new-image",
  upload.single("file"),
  async (req: Request, res: Response) => {
    console.log(req.file);
    //res.send({ message: "File uploaded succesfully" });
    /* try {
      console.log("event/new-image endpoint called");
      //Getting the user informations:
      const user = await User.findOne({ email: req.user.email });
      if (!user) return res.status(400).json({ message: "User not found" });
      //console.log("Request:", req);
      // Extracting image and ID from the request
      //console.log("File:", req.file);
      const image = req.file ? req.file : null;
      const eventId = req.body.id;

      const currentEvent = await Event.findById(eventId);
      if (!currentEvent)
        return res.status(404).json({ message: "Event not found" });
      //Image validation is still nessecary
      const oldImages = currentEvent.images;
      oldImages.push(image.originalname);
      const newEvent = await currentEvent.save();
      // 201 is the create code
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    } */
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const filePath = path.join("/src/uploads", req.file.originalname);

      // At this point, the file has been successfully uploaded
      // You can do further processing here, like saving the file path to a database, etc.
      res.status(200).json({ message: "File uploaded successfully", filePath });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

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
