const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registerUser, loginUser, storeData, getUserData, checkUserData } = require('../controllers/authController');

router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], registerUser);

router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], loginUser);

router.post('/store-data', [
    body('userId').notEmpty(),
    body('data').notEmpty()
], storeData);

router.get('/get-user-data/:userId', getUserData);
router.get('/check-user-data/:userId', checkUserData);

module.exports = router;