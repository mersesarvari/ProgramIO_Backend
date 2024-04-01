import { IEvent, Event } from "../models/eventModel";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";

export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

export async function CheckEventPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check if the user is authenticated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the event exists
    const eventId = req.params.eventId; // Assuming event ID is in URL params
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user has permission to delete the event
    if (event.userId.toString() !== user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this event" });
    }

    // User has permission, proceed to delete the event
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
