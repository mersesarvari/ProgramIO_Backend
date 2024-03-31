import { Schema } from "mongoose";

export interface IEventImage {
  name: string;
  dateModified: Date;
  url: string;
  type: string;
  extension: string;
}

export const eventImageSchema = new Schema<IEventImage>({
  name: { type: String, required: true },
  dateModified: { type: Date, required: true, default: new Date() },
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
});
