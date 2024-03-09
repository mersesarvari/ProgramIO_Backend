import express, { Request, Response } from "express";
const router = express.Router();
import User, { IUser } from "../models/userModel";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../validations/auth";
import jwt from "jsonwebtoken";

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
  console.log("Login called:", req.body);
  try {
    // Validating login fields
    const loginValidation = loginValidationSchema.validate(req.body);
    console.log(loginValidation);
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
    //Authentication
    console.log("User signed:", user.toObject());
    const accessToken = jwt.sign(
      user.toObject(),
      process.env.ACCESS_TOKEN_SECTER
    );
    //Retrieving the user login informations
    res
      .status(200)
      .json({ message: "Login successful", user, accessToken: accessToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/test", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.role === 0) {
      return res.status(403).json({ message: "You are a pussy" });
    }
    if (req.role === 3) {
      return res
        .status(403)
        .json({ message: "You are the god of this world!" });
    }

    res.status(200).json({ message: "Test successful", user: req.user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const tokenString = authHeader.toString();
  // console.log("tokenString:", tokenString);
  const token = tokenString.replace("Bearer ", "").trim();
  //console.log("Token:", token);

  //if (token == null) return res.sendStatus(401);
  if (token == null) return res.send({ message: "No token found" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECTER, (err, user) => {
    if (err)
      return res.status(403).send({ message: "Forbidden", erroMsg: err });
    req.user = user;
    next();
  });
}

export default router;
