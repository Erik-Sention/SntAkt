// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

// Firebase-konfiguration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app", 
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validera konfigurationen
if (!firebaseConfig.databaseURL) {
  console.error('Firebase: NÄTVERK FEL - databaseURL saknas i konfigurationen!');
  firebaseConfig.databaseURL = 'https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app';
}

if (!firebaseConfig.apiKey) {
  console.error('Firebase: KRITISKT FEL - apiKey saknas i konfigurationen!');
}

// Initiera Firebase
const apps = getApps();
const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
const auth = getAuth(app);
const db = getDatabase(app);
const functions = getFunctions(app);

export { app, auth, db, functions }; 