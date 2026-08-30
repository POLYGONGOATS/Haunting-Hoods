import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, TwitterAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// True only when real Firebase project credentials are present in .env.
// Used to fall back to a local mock (localStorage) implementation so the
// whitelist flow can be fully tested before a real project is wired up.
export const isFirebaseConfigured = Boolean(
	firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('your_')
);

let auth = null;
let twitterProvider = null;
try {
	if (isFirebaseConfigured) {
		auth = getAuth(app);
		twitterProvider = new TwitterAuthProvider();
	}
} catch (error) {
	// Happens when VITE_FIREBASE_API_KEY etc. are still placeholders (local
	// dev without a real Firebase project configured). Auth-dependent
	// features (whitelist claim) will simply be unavailable until real
	// credentials are provided in .env.
	console.warn('Firebase Auth initialization failed:', error);
}

let analytics = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
	try {
		analytics = getAnalytics(app);
	} catch (error) {
		console.warn('Analytics initialization failed:', error);
	}
}

export { db, analytics, auth, twitterProvider };
