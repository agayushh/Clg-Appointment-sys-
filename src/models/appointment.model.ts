import mongoose, { Mongoose } from "mongoose";
import { Iuser } from "./user.model";
import { Iavail } from "./availability.models";

enum Status {
  Booked = "booked",
  Cancelled = "cancelled",
}

interface Iappoint extends mongoose.Document {
  professor: mongoose.Schema.Types.ObjectId | Iuser;
  student: mongoose.Schema.Types.ObjectId | Iuser;
  availability: mongoose.Schema.Types.ObjectId | Iavail;
  status: Status;
  createdAt: Date;
}

const appointmentSchema = new mongoose.Schema<Iappoint>(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
      isBooked: Boolean,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Appointment = mongoose.model<Iappoint>(
  "Appointment",
  appointmentSchema
);
