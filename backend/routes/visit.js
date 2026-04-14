const express = require('express');
const { getVisits, createVisit, updateVisit, deleteVisit } = require('../controllers/visitController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getVisits)
  .post(protect, createVisit);

router.route('/:id')
  .put(protect, updateVisit)
  .delete(protect, deleteVisit);

module.exports = router;
