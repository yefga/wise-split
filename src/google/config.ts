import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics'

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

// Only initialize if all required config values are present
const isConfigValid = () => {
    return !!(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.appId &&
        firebaseConfig.measurementId
    );
};

if (isConfigValid()) {
    try {
        app = initializeApp(firebaseConfig);
        // Initialize Analytics only in browser environment
        if (typeof window !== 'undefined') {
            analytics = getAnalytics(app);
            console.log('✅ Firebase Analytics initialized successfully');
        }
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }
} else {
    console.warn('⚠️ Firebase config is incomplete. Analytics will not be available.');
    console.warn('Please ensure all environment variables are set in your .env file');
}

export { app, analytics };