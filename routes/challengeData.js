const express = require('express');
const router = express.Router();
const { getChallenges, updateChallengeStatus } = require('../controllers/challengeController');

router.get('/challenges', getChallenges);
router.put('/challenges/status', updateChallengeStatus);

module.exports = router;