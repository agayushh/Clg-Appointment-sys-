import mongoose from "mongoose";
import { Iuser } from "./user.model";
import { Iavail } from "./availability.models";

enum Status {
  Booked = "booked",
  Cancelled = "cancelled",
}

interface Iappoint {
  professor: Iuser;
  student: Iuser;
  availability: Iavail;
  status: Status;
  createdAt: Date;
}

const appointmentSchema = new mongoose.Schema<Iappoint>({
  professor: {
    type: String,
    profId: Number,
    required: true,
  },
  student: {
    type: String,
    email: String,
    required: true,
  },
  availability: {
    startTime: Date,
    endTime: Date,
    isBooked: Boolean,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});
