import { Avaialabilty } from "../models/availability.models";
import { User } from "../models/user.model";
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

  try {
    const professor = await User.findOne({
      profId: profId,
      role: "professor",
    });
    if (!professor)
      return res
        .status(404)
        .json({ message: "Professor not found with this profId" });
    const existingSlot = await Avaialabilty.findOne({
      professor: professor._id,
      appDate,
      availability: {
        $elemMatch: {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      },
    });
    if (existingSlot) return res.status(400).json({ message: "Overlapping" });

    const newSlot = await Avaialabilty.findOneAndUpdate(
      { professor: professor._id, appDate },
      { $push: { availability: { startTime, endTime, isBooked: false } } },
      { upsert: true, new: true }
    ).populate("professor", "name email profId role");
    await newSlot.save();
    res.status(201).json({
      message: "Slot created successfully",
      slot: newSlot,
    });
  } catch (error) {}
});

const showAvailableSlots = asyncHandler(async (req, res) => {
  const { profId } = req.params;
  const { appDate } = req.query;
  if (!profId || !appDate) {
    return res.status(400).json({ message: "date required" });
  }

  try {
    const professor = await User.findOne({
      profId: profId,
      role: "professor",
    });

    if (!professor) {
      return res
        .status(404)
        .json({ message: "Professor not found with this profId" });
    }
    const allSlots = (await Avaialabilty.find({
      professor: professor._id,
      appDate: appDate,
    }).populate("professor", "name email profId role")) as any;

    if (!allSlots || allSlots.length === 0) {
      return res.status(400).json({ message: "No slots" });
    }
    const availableSlots = allSlots.flatMap((x: any) =>
      x.availability.map((a: any) => ({
        startTime: a.startTime,
        endTime: a.endTime,
        isBooked: a.isBooked,
      }))
    );
    res.status(200).json({
      professor: {
        profId: allSlots[0].professor.profId, // Getting profId from User table
        name: allSlots[0].professor.name,
        email: allSlots[0].professor.email,
      },
      appDate,
      availableSlot: availableSlots,
    });
  } catch (error: any | null) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });
  }
});

const deleteSlot = asyncHandler(async (req, res) => {
  const { profId } = req.params;
  const { startTime, appDate } = req.body;

  if (!profId || !startTime || !appDate)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const professor = await User.findOne({
      profId: profId,
      role: "professor",
    });

    if (!professor) {
      return res
        .status(404)
        .json({ message: "Professor not found with this profId" });
    }
    const slotToDelete = await Avaialabilty.findOneAndUpdate(
      {
        professor: profId,
        appDate,
      },
      { $pull: { availability: { startTime } } },
      { new: true }
    ).populate("professor", "name email profId role");

    if (!slotToDelete)
      return res.status(400).json({ message: "slot doesnt exist" });

    res.status(200).json({
      message: "Slot deleted successfully",
      slot: slotToDelete,
    });
  } catch (error) {}
});
const updateSlot = asyncHandler(async (req, res) => {
  const { profId } = req.params;
  const { appDate, startTime, endTime, newendTime, newstartTime, newAppDate } =
    req.body;

  if (!profId || !appDate || !startTime)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const professor = await User.findOne({
      profId: profId,
      role: "professor",
    });

    if (!professor) {
      return res
        .status(404)
        .json({ message: "Professor not found with this profId" });
    }
    const findSlot = await Avaialabilty.findOneAndUpdate(
      {
        professor: profId,
        appDate,
        "availability.startTime": startTime,
      },
      {
        $set: {
          "availability.$.startTime": newstartTime || startTime,
          "availability.$.endTime": newendTime || endTime,
          ...(newAppDate && { appDate: newAppDate }),
        },
      },
      { new: true, runValidators: true }
    ).populate("professor", "name email profId role");
    if (!findSlot)
      return res.status(400).json({ message: "No such slot exist" });

    res.status(200).json({ message: "Slot updated successfully" });
  } catch (error) {}
});
export { createAvailability, showAvailableSlots, deleteSlot, updateSlot };
