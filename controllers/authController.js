// authController.js

const { validationResult } = require('express-validator');
const admin = require('firebase-admin');
const db = admin.firestore();

// Register User Controller
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password
        });
        // Return uid as expected by frontend
        res.status(201).send({ uid: userRecord.uid });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Login User Controller
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        // Here, we do not have password verification with Firebase Admin SDK, so we are just checking for the user.
        res.status(200).send({ uid: user.uid });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Store Form Input Controller
exports.storeData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, data } = req.body;
    try {
        await db.collection('users').doc(userId).set(data);
        res.status(200).send({ message: 'Data stored successfully' });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.challengeData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, data } = req.body;
    try {
        await db.collection('challenges').doc(userId).set(data);
        res.status(200).send({ message: 'Data stored successfully' });
    } catch (error) {
        res.status(400).send(error.message);
    }
}