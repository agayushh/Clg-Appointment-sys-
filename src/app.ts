import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const upload = multer();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(upload.none());

import { UserRouter } from "./routes/user.route";
import { AppointmentRouter } from "./routes/appointment.route";
import { AvailabilityRouter } from "./routes/availability.route";

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/users/avail", (req, res, next) => {
    console.log('Availability route hit:', req.method, req.path);
    next();
}, AvailabilityRouter);
app.use("/api/v1/users/appoint/:profId", AppointmentRouter);

export { app };
