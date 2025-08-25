import mongoose from "mongoose";
import { Iuser } from "./user.model";

export interface Iavail {
  professor: Iuser;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  createdAt: Date;
}

const availabiltySchema = new mongoose.Schema<Iavail>({
  professor: {
    type: String,
    profId: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    require: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

export const Avaialbilty = mongoose.model<Iavail>(
  "Avaialbilty",
  availabiltySchema
);
