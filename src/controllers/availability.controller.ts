import { Avaialbilty } from "../models/availability.models";
import { asyncHandler } from "../utils/asyncHandler";

//here first we need to get data from frontend
//see the role if it is professor or student
//for professor give them the access to manage the availability
//students can only view it
//professors can add slots, delete slots

const createAvailability = asyncHandler(async (req, res) => {
  const { startTime, endTime, profId, appDate, role } = req.body;

  if (role.trim().toLowerCase() !== "professor" || !role) {
    return res
      .status(403)
      .json({ message: "Only professors can create slots" });
  }
  if (!startTime || !endTime || !profId || !appDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check if the slot exists

  const existingSlot = await Avaialbilty.findOne({
    professor: profId,
    appDate,
    availability: {
      $elemMatch: { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
    },
  });
  if (existingSlot) return res.status(400).json({ message: "Overlapping" });

  const newSlot = await Avaialbilty.findOneAndUpdate(
    { professor: profId, appDate },
    { $push: { availability: { startTime, endTime, isBooked: false } } },
    { upsert: true, new: true }
  );
  await newSlot.save();
  res.status(201).json({
    message: "Slot created successfully",
    slot: newSlot,
  });
});

const showAvailableSlots = asyncHandler(async (req, res) => {
  const { profId } = req.params;
  const { appDate } = req.body;
  if (!profId || !appDate) {
    return res
      .status(400)
      .json({ message: "email of professor and date required" });
  }
  const startOfDay = new Date(appDate as string);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appDate as string);
  endOfDay.setHours(23, 59, 59, 999);

  const allSlots = await Avaialbilty.find({
    professor: profId,
    startTime: { $gt: startOfDay, $lt: endOfDay },
  });

  if (!allSlots || allSlots.length === 0) {
    return res.status(400).json({ message: "No slots" });
  }

  res.status(200).json({
    professor: profId,
    appDate,
    availableSlot: allSlots.flatMap((slot) =>
      slot.availability.map((a) => ({
        startTime: a.startTime,
        endTime: a.endTime,
        isBooked: a.isBooked,
      }))
    ),
  });
});

const deleteSlot = asyncHandler(async (req, res) => {
  const { profId } = req.params;
  const { startTime, appDate } = req.body;

  if (!profId || !startTime || !appDate)
    return res.status(400).json({ message: "All fields are required" });

  const startTimeDate = new Date(appDate as string);
  startTimeDate.setHours(0, 0, 0, 0);
  const slotToDelete = await Avaialbilty.findOneAndUpdate(
    {
      professor: profId,
      appDate,
    },
    { $pull: { availability: { startTime } } },
    { new: true }
  );

  if (!slotToDelete)
    return res.status(400).json({ message: "slot doesnt exist" });

  res.status(200).json({
    message: "Slot deleted successfully",
    slot: slotToDelete,
  });
});

export { createAvailability, showAvailableSlots, deleteSlot };
