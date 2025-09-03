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

export { createAvailability };
