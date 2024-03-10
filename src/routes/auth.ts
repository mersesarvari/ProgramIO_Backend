import express, { Request, Response } from "express";
const router = express.Router();
import { IUser, User } from "../models/userModel";
import { HashPassword } from "../models/authModel";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../validations/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      password: await HashPassword(req.body.password),
      confirmPassword: await HashPassword(req.body.confirmPassword),
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
    console.log(loginValidation);
    if (loginValidation.error) {
      return res.status(400).json({ message: loginValidation.error.message });
    }
    // Checking login information

    const user = await User.findOne({
      email: req.body.email,
    });
    //Checking if the user exists with the current email
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //Checking if the password is good
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCheck) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Authentication

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    //Adding refreshToken to the user
    user.refreshTokens.push(refreshToken);
    await user.save();

    //Retrieving the user login informations
    res.status(200).json({
      message: "Login successful",
      user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/token", async (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  //Checking if the refresh token is valid and exists in the server
  if (refreshToken == null) return res.sendStatus(401);
  if (req.user) return res.sendStatus(401).json({ message: "User not found" });
  //Checking if the user contains the secret key!
});

function generateAccessToken(user) {
  let userForToken = CleanUserDataForToken(user);
  return jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECTER, {
    expiresIn: "15s",
  });
}

function generateRefreshToken(user) {
  let userForToken = CleanUserDataForToken(user);
  return jwt.sign(userForToken, process.env.REFRESH_TOKEN_SECRET);
}

function CleanUserDataForToken(user: IUser) {
  const userObjectForToken = {
    username: user.username,
    email: user.email,
    role: user.role,
    acticated: user.activated,
  };
  return userObjectForToken;
}

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

export function CheckRoleRequirement(req, res, requiredRole) {
  if (req.user.role < requiredRole) {
    return false;
  }
  return true;
}

export default router;
