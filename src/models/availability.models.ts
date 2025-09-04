import mongoose from "mongoose";
import { Iuser } from "./user.model";

export interface Iavail extends mongoose.Document {
  professor: mongoose.Schema.Types.ObjectId | Iuser;
  appDate: String;
  availability: { startTime: String; endTime: String; isBooked: boolean }[];
}

const availabiltySchema = new mongoose.Schema<Iavail>({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appDate: {
    type: String,
    required: true,
  },
  availability: [
    {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      isBooked: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],

});

export const Avaialbilty = mongoose.model<Iavail>(
  "Avaialbilty",
  availabiltySchema
);
