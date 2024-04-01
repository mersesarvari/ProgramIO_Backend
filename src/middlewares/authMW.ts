import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

export function Authenticate(req, res, next) {
  //Checking if token exists
  const accessToken = req.cookies["access_token"];
  if (accessToken == null) {
    console.log("No access token provided!");
    return res.status(400).json({ message: "No access token provided!" });
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECTER,
    async (err, user) => {
      if (err) {
        let errorMessage = "An error occurred while verifying the token.";
        let errorCode;
        // Provide more specific error messages based on error type:
        switch (err.name) {
          case "TokenExpiredError":
            errorMessage = "The token has expired. Please re-authenticate.";
            errorCode = 430;
            break;
          case "JsonWebTokenError":
            errorMessage = "The token is malformed or invalid.";
            errorCode = 430;
            break;
          case "NotBeforeError":
            errorMessage = "The token is not yet active.";
            errorCode = 430;
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
          .status(errorCode)
          .send({ message: "Forbidden", errorMsg: errorMessage });
      }
      //Getting the user from database:
      const currentUser = await User.findOne({ email: user.email });
      if (!currentUser)
        return res.status(400).json({ message: "User not found" });
      user.id = currentUser._id.toString();
      req.user = user;
      next();
    }
  );
}
