import express from "express";
import {
  createAvailability,
  deleteSlot,
  showAvailableSlots,
  updateSlot,
} from "../controllers/availability.controller";
const AvailabilityRouter = express.Router();

AvailabilityRouter.get("/:profId", showAvailableSlots);

AvailabilityRouter.post("/create", createAvailability);

AvailabilityRouter.put("/update/:id", updateSlot);

AvailabilityRouter.delete("/delete/:id", deleteSlot);

export { AvailabilityRouter };
