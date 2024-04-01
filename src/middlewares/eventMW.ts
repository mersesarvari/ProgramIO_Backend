import { IEvent, Event } from "../models/eventModel";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";

export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("[getEventById]:  EventId = ", req.params.eventId);
    const event = await Event.findById(req.params.eventId);
    const eventIds = await Event.distinct("_id");
    console.log(eventIds);
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
    console.log("CheckEventPermission");
    // Check if the event exists
    const eventId = req.params.eventId;
    console.log("Event:", req.params);
    if (!eventId) {
      return res
        .status(404)
        .json({ message: "eventId is missing from the request body" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("UserId:", req.user);
    // Check if the user has permission to delete the event
    if (event.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this event" });
    }

    // User has permission, proceed to delete the event
    req.event = event;
    next();
  } catch (error) {
    return res.status(500).json({
      message: `[CheckEventPermission] Internal Server Error: ${error}`,
    });
  }
}
