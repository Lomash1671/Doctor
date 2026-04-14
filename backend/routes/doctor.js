const express = require('express');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getDoctors)
  .post(protect, createDoctor);

router.route('/:id')
  .put(protect, updateDoctor)
  .delete(protect, deleteDoctor);

module.exports = router;
