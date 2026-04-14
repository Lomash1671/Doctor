const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');

exports.getDoctors = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search 
    ? { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } }
        ] 
      } 
    : {};
    
  const doctors = await Doctor.find(query);
  res.json(doctors);
});

exports.createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
});

exports.updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  res.json(doctor);
});

exports.deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  await doctor.deleteOne();
  res.json({ message: 'Doctor deleted' });
});
