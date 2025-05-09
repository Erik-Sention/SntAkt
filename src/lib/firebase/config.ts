// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFunctions, Functions } from 'firebase/functions';

// Din Firebase-konfiguration
// TODO: Ersätt med din egen Firebase-konfiguration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app", // Viktigt för Realtime Database
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validera konfigurationen innan vi försöker initiera Firebase
// Kontrollera särskilt databaseURL som är kritisk för Realtime Database
if (!firebaseConfig.databaseURL) {
  console.error('Firebase: NÄTVERK FEL - databaseURL saknas i konfigurationen!');
  // Använd en fallback URL för att undvika krasch men logga fel
  firebaseConfig.databaseURL = 'https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app';
}

console.log('Firebase: Initierar med konfiguration', {
  apiKey: firebaseConfig.apiKey ? 'Inställd' : 'SAKNAS',
  authDomain: firebaseConfig.authDomain ? 'Inställd' : 'SAKNAS',
  projectId: firebaseConfig.projectId ? 'Inställd' : 'SAKNAS',
  databaseURL: firebaseConfig.databaseURL ? 'Inställd' : 'SAKNAS',
  storageBucket: firebaseConfig.storageBucket ? 'Inställd' : 'SAKNAS',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Inställd' : 'SAKNAS',
  appId: firebaseConfig.appId ? 'Inställd' : 'SAKNAS'
});

// Initiera Firebase endast om det inte redan finns en instans
const existingApps = getApps();
console.log(`Firebase: ${existingApps.length} existerande app-instanser`);

// Explicitly type these variables
let app: FirebaseApp;
let auth: Auth;
let db: Database;
let functions: Functions;

try {
  // Initiera app först
  app = !existingApps.length ? initializeApp(firebaseConfig) : existingApps[0];
  console.log('Firebase: App initierad', app.name);

  auth = getAuth(app);
  console.log('Firebase: Auth-tjänst initierad');

  db = getDatabase(app);
  console.log('Firebase: Database-tjänst initierad', db.app.name);
  
  // Sätt timeout på databasoperationer genom en configvariabel
  if (db) {
    try {
      // @ts-expect-error - Vissa versioner av Firebase har inte direkt stöd för denna prop
      db._repoInternal.repo.dataUpdateCount = 5000; // Försök sätta lägre timeout
      console.log('Firebase: Satte custom dataUpdateCount');
    } catch (e) {
      console.log('Firebase: Kunde inte sätta custom dataUpdateCount', e);
    }
  }

  functions = getFunctions(app);
  console.log('Firebase: Functions-tjänst initierad');
} catch (error) {
  console.error('Firebase: Kritiskt fel vid initiering:', error);
  
  // Försäkra att app är initierad först
  const fallbackApp = initializeApp({
    apiKey: "fallback-key",
    authDomain: "fallback-domain.firebaseapp.com",
    databaseURL: "https://sentionaktivitus-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fallback-project",
  }, "fallback-app");
  
  app = fallbackApp;
  
  try {
    auth = getAuth(app);
    db = getDatabase(app);
    functions = getFunctions(app);
    console.log('Firebase: Skapade en fallback-app efter fel');
  } catch (secondError) {
    console.error('Firebase: Kunde inte skapa fallback-app:', secondError);
    
    // Skapa en sista instans med mockad data för att undvika null
    try {
      const mockApp = initializeApp({
        apiKey: "mock-key",
        authDomain: "mock-domain.firebaseapp.com",
        databaseURL: "https://mock-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "mock-project",
      }, "mock-app");
      
      app = mockApp;
      auth = getAuth(mockApp);
      db = getDatabase(mockApp);
      functions = getFunctions(mockApp);
      console.log('Firebase: Skapade en mock-app för säker återhämtning');
    } catch (finalError) {
      console.error('Firebase: Kunde inte skapa mock-app:', finalError);
      throw new Error('Kunde inte initiera Firebase på något sätt');
    }
  }
}

export { app, auth, db, functions }; 