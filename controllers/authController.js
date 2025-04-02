const { validationResult } = require('express-validator');
const admin = require('firebase-admin');

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

        // Create a custom token
        const token = await admin.auth().createCustomToken(userRecord.uid);

        res.status(201).json({
            uid: userRecord.uid,
            token
        });
    } catch (error) {
        console.error('Error in registerUser:', error);
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
        // Create a custom token
        const token = await admin.auth().createCustomToken(user.uid);

        res.status(200).json({
            uid: user.uid,
            token
        });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(400).send(error.message);
    }
};

// Store Form Input Controller
exports.storeData = async (req, res) => {
    const { userId, data } = req.body;
    try {
        await admin.firestore().collection('users').doc(userId).set(data);
        res.status(200).send({ message: 'Data stored successfully' });
    } catch (error) {
        console.error('Error in storeData:', error);
        res.status(400).send(error.message);
    }
};

exports.checkUserData = async (req, res) => {
    const { userId } = req.params;
    try {
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        res.status(200).json({
            exists: userDoc.exists,
            message: userDoc.exists ? 'User data found' : 'No user data found'
        });
    } catch (error) {
        console.error('Error in checkUserData:', error);
        res.status(400).send(error.message);
    }
};

exports.getUserData = async (req, res) => {
    const { userId } = req.params;
    try {
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User data not found' });
        }

        res.status(200).json({
            exists: true,
            data: userDoc.data()
        });
    } catch (error) {
        console.error('Error in getUserData:', error);
        res.status(400).send(error.message);
    }
};