import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { User, IUser } from "../models/userModel";
import { HashPassword } from "../models/authModel";
import { Authenticate } from "../middlewares/authMW";
import { convertToWebP, upload } from "../middlewares/fileMW";
import { Event } from "../models/eventModel";
const fs = require("fs");
const path = require("path");

//TODO: Adding admin role validation or deleting only my event... IMPORTANT
const RoleRequirement = 3;

//CREATE-EVENT-IMAGE
router.post(
  "/event-image",
  Authenticate,
  upload.single("file"),
  convertToWebP,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
      // At this point, the file has been successfully uploaded
      // You can do further processing here, like saving the file path to a database, etc.
      const user = await User.findOne({ email: req.user.email });
      if (!user) return res.status(400).json({ message: "User not found" });
      const eventId = req.body.id;

      const currentEvent = await Event.findById(eventId);
      if (!currentEvent)
        return res.status(404).json({ message: "Event not found" });
      console.log("Image.webpath:", req.webpName);
      const oldImages = currentEvent.images;
      const newImage = {
        name: req.webpName,
        url: req.webpPath,
        extension: ".webp",
        dateModified: new Date(),
        //TODO: changing from none if the image is set a a cover
        type: "none",
      };

      oldImages.push(newImage);
      await currentEvent.save();
      res.status(201).json({ message: "Image uploaded succesfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
// Get all images for a specific event
router.get("/:id", Authenticate, async (req, res) => {
  console.log("Get all images endpoint called ");
  try {
    const eventId = req.params.id;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Serve all images associated with the event
    const images = event.images;
    const test = path.join(__dirname, "..", "..");
    console.log("Dirname:", test);
    const imagePaths = images.map((image) =>
      path.join(__dirname, "..", "..", image.url)
    ); // Assuming images are stored in 'src/uploads' directory
    console.log("path:", imagePaths);
    // Check if each image file exists and send them
    const imagePromises = imagePaths.map(async (imagePath) => {
      if (fs.existsSync(imagePath)) {
        return fs.promises.readFile(imagePath);
      } else {
        return null;
      }
    });

    // Wait for all image reading promises to resolve
    const imageBuffers = await Promise.all(imagePromises);

    // Send image data as base64 strings
    const imageData = imageBuffers.map((imageBuffer) => {
      if (imageBuffer) {
        return imageBuffer.toString("base64");
      } else {
        return null;
      }
    });

    res.json(imageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an image for a specific event
router.delete("/:id", Authenticate, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const imageName = req.params.imageName;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Find the index of the image to delete
    const imageIndex = event.images.findIndex((img) => img.name === imageName);
    if (imageIndex === -1)
      return res.status(404).json({ message: "Image not found" });

    // Remove the image from the images array
    event.images.splice(imageIndex, 1);

    // Save the updated event
    await event.save();

    // Construct the file path of the image to delete
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      event.images[imageIndex].url
    );

    // Check if the image file exists and delete it
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

export default router;
