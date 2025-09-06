"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
exports.app = app;
const upload = (0, multer_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(upload.none());
const user_route_1 = require("./routes/user.route");
const appointment_route_1 = require("./routes/appointment.route");
const availability_route_1 = require("./routes/availability.route");
app.use("/api/v1/users", user_route_1.UserRouter);
app.use("/api/v1/users/avail", (req, res, next) => {
    console.log('Availability route hit:', req.method, req.path);
    next();
}, availability_route_1.AvailabilityRouter);
app.use("/api/v1/users/appoint/:profId", appointment_route_1.AppointmentRouter);
