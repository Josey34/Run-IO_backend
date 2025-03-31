const admin = require('firebase-admin');
const db = admin.firestore();

// Get Challenges Controller
exports.getChallenges = async (req, res) => {
    try {
        const challengesSnapshot = await db.collection('challanges').get();
        const challenges = challengesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
};

exports.updateChallengeStatus = async (req, res) => {
    const { challengeId, completed } = req.body;

    try {
        // Query the document by the 'id' field, not the document ID
        const querySnapshot = await db.collection('challanges')
            .where('id', '==', Number(challengeId))
            .get();

        if (querySnapshot.empty) {
            return res.status(404).json({
                error: 'Challenge not found',
                details: `No challenge found with ID: ${challengeId}`
            });
        }

        // Get the first (and should be only) matching document
        const doc = querySnapshot.docs[0];
        const currentData = doc.data();

        // Update using the document reference
        await doc.ref.update({
            completed: completed
        });

        // Return the updated data in the same format as your GET
        res.status(200).json({
            message: 'Challenge status updated successfully',
            challenge: {
                id: currentData.id,
                type: currentData.type,
                distance: currentData.distance,
                pace: currentData.pace,
                duration: currentData.duration,
                completed: completed
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            error: 'Failed to update challenge status',
            details: error.message
        });
    }
};