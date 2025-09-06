import { Appointment } from "../models/appointment.model";
import { Avaialabilty } from "../models/availability.models";
import { asyncHandler } from "../utils/asyncHandler";

const allAppointments = asyncHandler(async (req, res) => {
  const { email, appDate } = req.body;
  const { profId } = req.params;

  if (!email || !appDate)
    return res.status(400).json({ message: "All fields are required" });

  const slots = await Appointment.find({
    student: email,
    professor: profId,
    appDate,
  });

  if (!slots || slots.length === 0)
    return res.status(400).json({ message: "No slot there" });

  return res.status(200).json();
});

const scheduleAppointment = asyncHandler(async (req, res) => {
  const { email, availability, status, appDate, startTime, endTime, isBooked } =
    req.body;
  const { profId } = req.params;

  if (!email || !profId || !availability || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // if (availability.isBooked === "true") {
  //   return res.status(400).json({ message: "slot already booked" });
  // }

  const findAvailableSlot = await Appointment.findOne({
    professor: profId,
    appDate,
    student: email,
    "availability.startTime": startTime,
    status: "booked",
  });
  if (findAvailableSlot)
    return res.status(400).json({ message: "Slot already booked" });

  const newSlot = await Appointment.create({
    professor: profId,
    student: email,
    availability: { startTime, endTime, isBooked: true },
    status: "booked",
  });
  await newSlot.save();

  await Avaialabilty.findOneAndUpdate(
    {
      professor: profId,
      appDate,
      "availability.startTime": startTime,
      "availability.endTime": endTime,
    },
    {
      $set: { "availability.isBooked": true },
    }
  );
  return res.status(200).json({ message: "Slot created" });
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const { email, status, appDate, startTime } = req.body;
  const { profId } = req.params;

  if (!email || !profId || !appDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (status === "cancelled") {
    return res.status(400).json({ message: "slot already cancelled" });
  }

  const slotToCancel = await Appointment.findOneAndUpdate(
    {
      professor: profId,
      student: email,
      "availability.startTime": startTime,
      status: "booked",
      appDate,
    },
    { $set: { status: "cancelled" } }
  );

  if (!slotToCancel) {
    return res.status(400).json({ message: "slot not found" });
  }
  await Avaialabilty.findOneAndUpdate(
    {
      professor: profId,
      appDate,
      "availability.startTime": startTime,
    },
    {
      $set: { "availability.isbooked": false },
    }
  );
  return res.status(200).json({ message: "Appointment cancelled" });
});


export {allAppointments, scheduleAppointment, cancelAppointment}