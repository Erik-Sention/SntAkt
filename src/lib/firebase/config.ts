// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFunctions, Functions } from 'firebase/functions';

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

// Initiera Firebase endast om det inte redan finns en instans
const existingApps = getApps();

// Explicit typning
let app: FirebaseApp;
let auth: Auth;
let db: Database;
let functions: Functions;

try {
  // Initiera Firebase
  if (existingApps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = existingApps[0];
  }
  
  // Initiera tjänster
  auth = getAuth(app);
  db = getDatabase(app);
  functions = getFunctions(app);
  
} catch (error) {
  console.error('Firebase: Kritiskt fel vid initiering:', error);
  
  try {
    // Fallback med hårdkodade värden som sista utväg
    console.warn('Firebase: Försöker skapa en fallback-app');
    
    const fallbackConfig = {
      apiKey: firebaseConfig.apiKey || "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6",
      authDomain: firebaseConfig.authDomain || "sentionaktivitus.firebaseapp.com",
      databaseURL: "https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: firebaseConfig.projectId || "sentionaktivitus",
      storageBucket: firebaseConfig.storageBucket || "sentionaktivitus.appspot.com",
      messagingSenderId: firebaseConfig.messagingSenderId || "123456789012",
      appId: firebaseConfig.appId || "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0"
    };
    
    app = initializeApp(fallbackConfig, "fallback-app");
    auth = getAuth(app);
    db = getDatabase(app);
    functions = getFunctions(app);
    
  } catch (secondError) {
    console.error('Firebase: Kunde inte skapa fallback-app:', secondError);
    
    // Skapa mock-objekt för att undvika app-krasch
    // @ts-expect-error - Vi bryter typsäkerheten för att undvika krasch
    app = {name: 'mock-app'};
    // @ts-expect-error - Mock av auth-objekt
    auth = {currentUser: null, onAuthStateChanged: () => () => {}};
    // @ts-expect-error - Mock av database-objekt
    db = {ref: () => ({})};
    // @ts-expect-error - Mock av functions-objekt
    functions = {httpsCallable: () => () => {}};
    
    console.error('Firebase: Skapade mock-objekt efter alla fel');
  }
}

export { app, auth, db, functions }; 