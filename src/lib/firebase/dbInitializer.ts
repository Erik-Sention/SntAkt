import { ref, set, get } from 'firebase/database';
import { db } from './config';

/**
 * Kontrollerar och initierar databasen om den saknar grundstrukturen
 */
export async function initializeDatabase(): Promise<void> {
  console.log('DbInitializer: Kontrollerar om databasen behöver initieras');

  try {
    // Kontrollera om "klienter" noden existerar
    const klienterRef = ref(db, 'klienter');
    const snapshot = await get(klienterRef);

    if (!snapshot.exists()) {
      console.log('DbInitializer: "klienter" noden existerar inte, skapar grundstruktur');
      
      // Skapa en tom klienter-nod för att säkerställa att strukturen finns
      await set(klienterRef, {});
      console.log('DbInitializer: Grundstruktur skapad');
    } else {
      console.log('DbInitializer: Databasen har redan grundstruktur');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('DbInitializer: Fel vid databasinitalisering:', error);
    return Promise.reject(error);
  }
} 