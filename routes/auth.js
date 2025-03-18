const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registerUser, loginUser, storeData } = require('../controllers/authController');

// Register route
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], registerUser);

// Login route
router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], loginUser);

// Store form input
router.post('/store-data', [
    body('userId').notEmpty(),
    body('data').notEmpty()
], storeData);

module.exports = router;