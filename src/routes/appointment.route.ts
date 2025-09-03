import express from 'express';

const AppointmentRouter = express.Router();

AppointmentRouter.get('/', (req, res) => {
  res.send('Get all appointments');
});

AppointmentRouter.post('/create', (req, res) => {
  res.send('Create an appointment');
});

AppointmentRouter.put('/update/:id', (req, res) => {
  res.send(`Update appointment with ID ${req.params.id}`);
});

AppointmentRouter.delete('/delete/:id', (req, res) => {
  res.send(`Delete appointment with ID ${req.params.id}`);
});

export { AppointmentRouter };