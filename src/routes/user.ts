import express from "express";
const router = express.Router();
import userSchema from "../models/userModel";
import User from "../models/userModel";

// Create
router.post("/", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const newUser = await user.save();
    // 201 is the create code
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get ALL
router.get("/", async (req, res) => {
  try {
    const objects = await User.find();
    res.json(objects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE
router.get("/:id", getObject, async (req, res) => {
  res.send(res.object);
});

// UPDATE
router.patch("/:id", getObject, async (req, res) => {
  try {
    if (req.body.username !== null) {
      res.object.username = req.body.username;
    }
    if (req.body.password !== null) {
      res.object.password = req.body.password;
    }

    const updatedObject = await res.object.save();
    res.json(updatedObject);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", getObject, async (req, res) => {
  try {
    await res.object.deleteOne();
    res.json({ message: "Deleted user!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getObject(req, res, next) {
  let object;
  try {
    object = await User.findById(req.params.id);
    if (object === null) {
      return res.status(404).json({ message: "Cannot find object!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.object = object;
  next();
}

export default router;
