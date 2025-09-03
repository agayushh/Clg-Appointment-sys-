import express from "express";
const AvailabilityRouter = express.Router();

AvailabilityRouter.get("/", (req, res) => {
  res.send("Get all availabilities");
});

AvailabilityRouter.post("/create", (req, res) => {
  res.send("Create an availability");
});

AvailabilityRouter.put("/update/:id", (req, res) => {
  res.send(`Update availability with ID ${req.params.id}`);
});

AvailabilityRouter.delete("/delete/:id", (req, res) => {
  res.send(`Delete availability with ID ${req.params.id}`);
});

export { AvailabilityRouter };
