import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { User, IUser } from "../models/userModel";
import { HashPassword } from "../models/authModel";
import { Authenticate } from "../middlewares/authMW";

const RoleRequirement = 3;

// Create
router.post("/", Authenticate, async (req: Request, res: Response) => {
  try {
    //Checking roles
    if (req.user.role < RoleRequirement) {
      return res
        .status(403)
        .json({ message: "You dont have the permission to access this!" });
    }

    const user: IUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: await HashPassword(req.body.password),
    });
    const newUser = await user.save();
    // 201 is the create code
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get ALL
router.get("/", Authenticate, async (req: Request, res: Response) => {
  try {
    console.log("User get all api called");
    //Checking roles
    if (req.user.role < RoleRequirement) {
      return res
        .status(401)
        .json({ message: "You dont have the permission to access this!" });
    }
    const objects = await User.find();
    console.log(objects);
    res.send(objects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE
router.get(
  "/:id",
  getObject,
  Authenticate,
  async (req: Request, res: Response) => {
    //Checking roles
    if (req.user.role < RoleRequirement) {
      return res
        .status(403)
        .json({ message: "You dont have the permission to access this!" });
    }
    res.send(res.locals.object);
  }
);

// UPDATE
router.patch(
  "/:id",
  getObject,
  Authenticate,
  async (req: Request, res: Response) => {
    try {
      //Checking roles
      if (req.user.role < RoleRequirement) {
        return res
          .status(403)
          .json({ message: "You dont have the permission to access this!" });
      }
      if (req.body.username !== null) {
        res.locals.object.username = req.body.username;
      }
      if (req.body.password !== null) {
        res.locals.object.password = await HashPassword(req.body.password);
      }

      const updatedObject = await res.locals.object.save();
      res.json(updatedObject);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

// DELETE
router.delete(
  "/:id",
  getObject,
  Authenticate,
  async (req: Request, res: Response) => {
    try {
      await res.locals.object.deleteOne();
      res.json({ message: "Deleted user!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

async function getObject(req: Request, res: Response, next: NextFunction) {
  try {
    const object = await User.findById(req.params.id);
    if (object === null) {
      return res.status(404).json({ message: "Cannot find object!" });
    }
    res.locals.object = object;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default router;
