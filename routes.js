const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const firebase = require('firebase/app');
require('firebase/auth');
const admin = require('firebase-admin');
const db = admin.firestore();

// Register route
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
        res.status(201).send({ userId: user.user.uid });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login route
router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password);
        res.status(200).send({ token: await user.user.getIdToken() });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Store form input
router.post('/store-data', [
    body('userId').notEmpty(),
    body('data').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, data } = req.body;
    try {
        const docRef = await db.collection('users').doc(userId).set(data);
        res.status(200).send({ message: 'Data stored successfully' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;