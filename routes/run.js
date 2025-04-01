const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { saveRun } = require('../controllers/runController');

// Save run data
router.post('/runs', [
    body('userId').notEmpty(),
    body('runData').notEmpty(),
    body('runData.startTime').notEmpty(),
    body('runData.endTime').notEmpty(),
    body('runData.distance').isNumeric(),
    body('runData.duration').notEmpty(),
    body('runData.averagePace').notEmpty(),
    body('runData.steps').isNumeric(),
    body('runData.route').isArray()
], saveRun);

module.exports = router;