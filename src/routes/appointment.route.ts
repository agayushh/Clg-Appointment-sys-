import express from "express";
import {
  allAppointments,
  cancelAppointment,
  scheduleAppointment,
} from "../controllers/appointment.controller";

const AppointmentRouter = express.Router();

AppointmentRouter.get("/", allAppointments);

AppointmentRouter.post("/create", scheduleAppointment);

AppointmentRouter.put("/update/:id", cancelAppointment);

export { AppointmentRouter };
