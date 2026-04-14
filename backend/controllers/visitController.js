const asyncHandler = require('express-async-handler');
const Visit = require('../models/Visit');

exports.getVisits = asyncHandler(async (req, res) => {
  const visits = await Visit.find().populate('patient doctor');
  res.json(visits);
});

exports.createVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.create(req.body);
  const populatedVisit = await Visit.findById(visit._id).populate('patient doctor');
  res.status(201).json(populatedVisit);
});

exports.updateVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patient doctor');
  if (!visit) {
    res.status(404);
    throw new Error('Visit not found');
  }
  res.json(visit);
});

exports.deleteVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findById(req.params.id);
  if (!visit) {
    res.status(404);
    throw new Error('Visit not found');
  }
  await visit.deleteOne();
  res.json({ message: 'Visit deleted' });
});
