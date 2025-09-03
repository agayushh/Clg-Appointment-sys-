import { Avaialbilty } from "../models/availability.models";
import { asyncHandler } from "../utils/asyncHandler";

//here first we need to get data from frontend
//see the role if it is professor or student
//for professor give them the access to manage the availability
//students can only view it
//professors can add slots, delete slots

const createAvailability = asyncHandler(async (req, res) => {
  const { startTime, endTime, profId, isBooked, role } = req.body;
  const date = new Date(startTime).toISOString().split("T")[0]; // just YYYY-MM-DD

  if (role.trim().toLowerCase() !== "professor" || !role) {
    return res
      .status(403)
      .json({ message: "Only professors can create slots" });
  }
  if (!startTime || !endTime || !profId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check if the slot exists

  const existingSlot = await Avaialbilty.findOne({
    profId,
    date,
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });
  if (existingSlot) return res.status(400).json({ message: "Overlapping" });

  const newSlot = new Avaialbilty({
    profId,
    date,
    startTime,
    endTime,
    isBooked: false,
  });
  await newSlot.save();
  res.status(201).json({
    message: "Slot created successfully",
    slot: newSlot,
  });
});

const showAvailableSlots = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { date } = req.query;
  if (!email || !date) {
    return res
      .status(400)
      .json({ message: "email of professor and date required" });
  }
  const startOfDay = new Date(date as string);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date as string);
  endOfDay.setHours(23, 59, 59, 999);

  const allSlots = await Avaialbilty.find({
    professor: email,
    startTime: { $gt: startOfDay, $lt: endOfDay },
  });

  if (!allSlots || allSlots.length === 0) {
    return res.status(400).json({ message: "No slots" });
  }

  res.status(200).json({
    professor: email,
    date,
    availableSlot: allSlots.flatMap((slot) =>
      slot.availability.map((a) => ({
        startTime: a.startTime,
        endTime: a.endTime,
        isBooked: a.isBooked,
      }))
    ),
  });
});

export { createAvailability, showAvailableSlots };
