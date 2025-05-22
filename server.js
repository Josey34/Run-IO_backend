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

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(helmet());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: false
}));

const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', apiLimiter);

let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (err) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err);
        }
    }
} catch (error) {
    console.error('Error loading Firebase service account:', error);
}



if (!admin.apps.length && serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
}

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

if (!firebase.getApps().length) {
    firebase.initializeApp(firebaseConfig);
}

// Routes
const authRoutes = require('./routes/auth');
const storeDataRoutes = require('./routes/storeData');
const challengeRoutes = require('./routes/challengeData');
const runRoutes = require('./routes/run');

app.use('/api', authRoutes);
app.use('/api', storeDataRoutes);
app.use('/api', challengeRoutes);
app.use('/api', runRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Run-IO Backend is running on Vercel!' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;