require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { checkEnvVariables } = require('./utils/checkEnvVariables');

const app = express();

// Validate environment variables
checkEnvVariables([
    'FIREBASE_SERVICE_ACCOUNT',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
]);

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(helmet());

// Update CORS configuration to match your frontend URL
app.use(cors({
    origin: 'http://localhost:19006', // Adjust the frontend URL if needed (e.g., Expo server URL)
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', apiLimiter);

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

const authRoutes = require('./routes/auth');
const storeDataRoutes = require('./routes/storeData');
const challengeRoutes = require('./routes/challengeData');
const runRoutes = require('./routes/run');

app.use('/api', authRoutes);
app.use('/api', storeDataRoutes);
app.use('/api', challengeRoutes);
app.use('/api', runRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});