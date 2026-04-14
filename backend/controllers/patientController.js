const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');

exports.getPatients = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search 
    ? { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ] 
      } 
    : {};

  const patients = await Patient.find(query);
  res.json(patients);
});

exports.createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
});

exports.updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
  res.json(patient);
});

exports.deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
  await patient.deleteOne();
  res.json({ message: 'Patient deleted' });
});
