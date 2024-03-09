import express, { Request, Response } from "express";
const router = express.Router();
import User, { IUser } from "../models/userModel";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../validations/auth";

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const registerValidation = registerValidationSchema.validate(req.body);
    // Checking email and password validation
    if (registerValidation.error) {
      return res
        .status(400)
        .json({ message: registerValidation.error.message });
    }
    // Checking if the user already exists or not
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Creating the user object for the database
    const user: IUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    const newUser = await user.save();
    // 201 is the create code
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Validating login fields
    const loginValidation = loginValidationSchema.validate(req.body);
    if (loginValidation.error) {
      return res.status(400).json({ message: loginValidation.error.message });
    }
    // Checking login information
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;