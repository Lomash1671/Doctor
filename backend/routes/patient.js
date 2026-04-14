const express = require('express');
const { getPatients, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getPatients)
  .post(protect, createPatient);

router.route('/:id')
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;
