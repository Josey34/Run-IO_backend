const express = require('express');
const router = express.Router();
const { db } = require('../firebase/firebaseAdmin');

router.post('/store-data', async (req, res) => {
    const { userId, data } = req.body;

    if (!userId || !data) {
        return res.status(400).json({
            errors: [
                { type: "field", msg: "Invalid value", path: "userId", location: "body" },
                { type: "field", msg: "Invalid value", path: "data", location: "body" },
            ]
        });
    }

    try {
        const userDoc = db.collection('users').doc(userId);
        await userDoc.set(data, { merge: true });
        res.status(200).json({ id: userDoc.id, message: "Data successfully saved" });
    } catch (error) {
        console.error("Error saving form data to Firestore:", error);
        res.status(500).json({ error: "Failed to save form data", details: error.message });
    }
});

module.exports = router;