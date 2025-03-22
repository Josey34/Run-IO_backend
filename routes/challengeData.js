const express = require('express');
const router = express.Router();
const { getChallenges } = require('../controllers/challengeController');

// Get challenges route
router.get('/challenges', getChallenges);

module.exports = router;