const { validationResult } = require('express-validator');
const { db } = require('../firebase/firebaseAdmin');

exports.saveRun = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, runData } = req.body;

    if (!userId || !runData) {
        return res.status(400).json({
            errors: [
                { type: "field", msg: "Invalid value", path: "userId", location: "body" },
                { type: "field", msg: "Invalid value", path: "runData", location: "body" },
            ]
        });
    }

    try {
        const runDoc = await db.collection('runs').add({
            userId,
            ...runData,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            id: runDoc.id,
            message: "Run data successfully saved"
        });
    } catch (error) {
        console.error("Error saving run data to Firestore:", error);
        res.status(500).json({
            error: "Failed to save run data",
            details: error.message
        });
    }
};

exports.fetchRun = async (req, res) => {
    try {
        const { userId } = req.params;

        const runsRef = db.collection('runs');
        const snapshot = await runsRef
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const runs = [];
        snapshot.forEach(doc => {
            runs.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(runs);
    } catch (error) {
        console.error("Error fetching runs:", error);
        res.status(500).json({ error: "Failed to fetch runs" });
    }
}