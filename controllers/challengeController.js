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