import express, { Request, Response } from "express";
const router = express.Router();
import { IUser, User } from "../models/userModel";
import { IRefreshToken, RefreshToken } from "../models/tokenModels";
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

router.post("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted" });
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
    });
    //Checking if the user exists with the current email
    if (!user) {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //Checking if the password is good
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCheck) {
      console.log("Invalid email or password by comparing passwords");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Authentication
    const accessToken = generateAccessToken(user);

    //Adding refreshToken to the database

    // Accessing client's IP address
    const clientIpAddress = req.ip || req.connection.remoteAddress;
    const clientPort = req.connection.remotePort;

    //Checking if the user has already have a valid refresh-token
    var validToken = await RefreshToken.findOne({
      address: clientIpAddress,
      active: true,
    });

    //Adding a token if the user has not have one
    if (!validToken) {
      const refreshToken = generateRefreshToken(user);
      validToken = new RefreshToken({
        value: refreshToken,
        address: clientIpAddress,
        port: clientPort,
      });
      await validToken.save();
      console.log(
        "No token found in the database, Generating new refresh token"
      );
    }

    await user.save();

    //Retrieving the user login informations
    res.status(200).json({
      message: "Login successful",
      user,
      accessToken: accessToken,
      refreshToken: validToken.value,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/token", async (req: Request, res: Response) => {
  //Extracting the refreshToken from the request
  const authHeader = req.headers["authorization"];
  const tokenString = authHeader.toString();
  const refreshToken = tokenString.replace("Bearer ", "").trim();
  //Checking if token exists
  if (refreshToken == null) {
    console.log("No refresh token provided!");
    return res.status(400).json({ message: "No refresh token provided!" });
  }

  const token = await RefreshToken.findOne({
    value: refreshToken,
  });
  if (!token) {
    console.log("Refresh token not found!\n", refreshToken);
    return res.status(400).json({ message: "No refresh token provided!" });
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const currentUser = {
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
    acticated: decoded.activated,
  };
  //Generating new access token
  const newToken = generateAccessToken(currentUser);
  return res.status(200).json({ accessToken: newToken });
});

function generateAccessToken(user) {
  let userForToken = CleanUserDataForToken(user);
  return jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECTER, {
    expiresIn: "3s",
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

  if (!authHeader) {
    return res.status(400).send({ message: "No authorization header found" });
  }
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(400).send({ message: "No token found" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECTER, (err, user) => {
    if (err) {
      let errorMessage = "An error occurred while verifying the token.";
      let errorCode;
      // Provide more specific error messages based on error type:
      switch (err.name) {
        case "TokenExpiredError":
          errorMessage = "The token has expired. Please re-authenticate.";
          errorCode = 403;
          break;
        case "JsonWebTokenError":
          errorMessage = "The token is malformed or invalid.";
          errorCode = 403;
          break;
        case "NotBeforeError":
          errorMessage = "The token is not yet active.";
          errorCode = 403;
          break;
        default:
          // Log the full error for further debugging
          errorMessage =
            "Unexpected JWT verification error:" + JSON.stringify(err);
          errorCode = 400;
          break;
      }
      console.log("JWT verify error: ", errorMessage);
      return res
        .status(499)
        .send({ message: "Forbidden", errorMsg: errorMessage });
    }

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
