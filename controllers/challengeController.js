const { default: axios } = require('axios');
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
                userId: currentData.id,
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

exports.predictRunMetrics = async (req, res) => {
    console.log('Received req', req.body);
    const { userId, userData } = req.body;

    console.log('Received userId:', userId);
    console.log('Received userData:', userData);

    try {
        // Call Python ML API
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

        // Save predictions to Firestore
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