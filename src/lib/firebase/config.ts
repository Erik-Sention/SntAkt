// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase-konfiguration med fallback-värden för development/production
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD_GISfSxjKh2n8HgwSKJVLqGcgbEfJp04",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sentionaktivitus.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sentionaktivitus",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app", 
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sentionaktivitus.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "456077393892",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:456077393892:web:3d40a6d8c618c11292d246"
};

// Logga för debugging
console.log('Firebase-konfiguration laddad');

// Validera konfigurationen
if (!firebaseConfig.databaseURL) {
  console.error('Firebase: NÄTVERK FEL - databaseURL saknas i konfigurationen!');
  firebaseConfig.databaseURL = 'https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app';
}

if (!firebaseConfig.apiKey) {
  console.error('Firebase: KRITISKT FEL - apiKey saknas i konfigurationen!');
}

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let functions: Functions;

try {
  // Initiera Firebase
  const apps = getApps();
  app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
  auth = getAuth(app);
  db = getDatabase(app);
  functions = getFunctions(app);

  console.log('Firebase initierad framgångsrikt');
} catch (error) {
  console.error('Fel vid initiering av Firebase:', error);
  throw error;
}

export { app, auth, db, functions }; 