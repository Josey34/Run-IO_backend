const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { saveRun, fetchRun } = require('../controllers/runController');
const { db } = require('../firebase/firebaseAdmin');
const { predictRunMetrics } = require('../controllers/challengeController');

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

router.get('/runs/:userId', fetchRun);
router.post('/predict-run', predictRunMetrics);
module.exports = router;