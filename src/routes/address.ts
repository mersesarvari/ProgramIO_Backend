import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import Address, { IAddress } from "../models/addressModel";

// Create
router.post("/", async (req: Request, res: Response) => {
  try {
    const address: IAddress = new Address({
      name: req.body.name,
      country: req.body.country,
      city: req.body.city,
      zipcode: req.body.zipcode,
      street: req.body.street,
      houseNumber: req.body.houseNumber,
      coordinates: {
        latitude: req.body.coordinates.latitude,
        longitude: req.body.coordinates.longitude,
      },
    });
    const newAddress = await address.save();
    // 201 is the create code
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get ALL
router.get("/", async (req: Request, res: Response) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE
router.get("/:id", getAddress, async (req: Request, res: Response) => {
  res.send(res.locals.address);
});

// UPDATE
router.patch("/:id", getAddress, async (req: Request, res: Response) => {
  try {
    if (req.body.name !== null) {
      res.locals.address.name = req.body.name;
    }
    if (req.body.country !== null) {
      res.locals.address.country = req.body.country;
    }
    if (req.body.city !== null) {
      res.locals.address.city = req.body.city;
    }
    if (req.body.zipcode !== null) {
      res.locals.address.zipcode = req.body.zipcode;
    }
    if (req.body.street !== null) {
      res.locals.address.street = req.body.street;
    }
    if (req.body.houseNumber !== null) {
      res.locals.address.houseNumber = req.body.houseNumber;
    }
    if (req.body.coordinates.longitude !== null) {
      res.locals.address.coordinates.longitude = req.body.coordinates.longitude;
    }
    if (req.body.coordinates.latitude !== null) {
      res.locals.address.coordinates.latitude = req.body.coordinates.latitude;
    }
    const updatedAddress = await res.locals.address.save();
    res.json(updatedAddress);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", getAddress, async (req: Request, res: Response) => {
  try {
    await res.locals.address.deleteOne();
    res.json({ message: "Deleted address!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await Address.findById(req.params.id);
    if (address === null) {
      return res.status(404).json({ message: "Cannot find address" });
    }
    res.locals.address = address;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default router;
