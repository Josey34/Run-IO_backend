const { default: axios } = require('axios');
const admin = require('firebase-admin');
const db = admin.firestore();

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
        if (!challengeId || completed === undefined) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Both challengeId and completed status are required'
            });
        }

        const docRef = db.collection('challanges').doc(challengeId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                error: 'Challenge not found',
                details: `No challenge found with ID: ${challengeId}`
            });
        }

        const currentData = doc.data();

        await docRef.update({
            completed: completed,
            updatedAt: new Date().toLocaleString('sv-SE').replace(' ', ' - ')
        });

        res.status(200).json({
            message: 'Challenge status updated successfully',
            challenge: {
                id: challengeId,
                userId: currentData.userId,
                type: currentData.type,
                distance: currentData.distance,
                speed: currentData.speed,
                duration: currentData.duration,
                completed: completed,
                updatedAt: new Date().toLocaleString('sv-SE').replace(' ', ' - ')
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

exports.predictRunMetrics = async (req, res) => {
    console.log('Received req', req.body);
    const { userId, userData } = req.body;

    console.log('Received userId:', userId);
    console.log('Received userData:', userData);

    try {
        const mlResponse = await axios.post(
            'https://josey04.pythonanywhere.com/predict',
            userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        const {
            "Distance(km)": distance,
            "Running Speed(km/h)": speed,
            "Running Time(min)": duration
        } = mlResponse.data;

        const challengeData = {
            userId,
            type: 'Running',
            distance,
            speed,
            duration,
            completed: false,
            createdAt: new Date().toLocaleString('sv-SE').replace(' ', ' - ')
        };

        console.log('Saving to Firestore:', challengeData);

        await db.collection('challanges').add(challengeData);

        res.status(200).json(mlResponse.data);
    } catch (error) {
        console.error('Prediction error:', error.message);

        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);

            res.status(error.response.status || 500).json({
                error: 'Prediction failed',
                details: error.response.data
            });
        } else if (error.request) {
            console.error('Error request:', error.request);
            res.status(500).json({
                error: 'Prediction failed',
                details: 'No response received from prediction server'
            });
        } else {
            console.error('Error message:', error.message);
            res.status(500).json({
                error: 'Prediction failed',
                details: error.message
            });
        }
    }
};