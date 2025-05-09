import { db } from './config';
import { 
  ref, 
  set, 
  push, 
  get, 
  remove, 
  update,
  DataSnapshot
} from 'firebase/database';

// En hjälperklass för att simulera Firestore Timestamp för kompatibilitet
export class RTDBTimestamp {
  seconds: number;
  nanoseconds: number;

  constructor(date?: Date) {
    const now = date || new Date();
    this.seconds = Math.floor(now.getTime() / 1000);
    this.nanoseconds = (now.getTime() % 1000) * 1000000;
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1000000);
  }

  static now(): RTDBTimestamp {
    return new RTDBTimestamp();
  }

  static fromDate(date: Date): RTDBTimestamp {
    return new RTDBTimestamp(date);
  }
}

export interface Client {
  id?: string;
  namn: string;
  telefon: string;
  email: string;
  testDatum?: RTDBTimestamp;
  anteckningar?: string;
  skapadDatum: RTDBTimestamp;
}

const DB_PATH = 'klienter';

// Cache för klienter
let clientCache: Client[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30000; // 30 sekunder

// Hämta alla klienter
export async function getAllClients(): Promise<Client[]> {
  console.log('getAllClients: Startar hämtning av alla klienter');
  const startTime = performance.now();
  
  // Kontrollera cache först
  const now = Date.now();
  if (clientCache && (now - lastCacheTime < CACHE_DURATION)) {
    console.log('getAllClients: Returnerar cacheade klienter', clientCache.length);
    return [...clientCache]; // Returnera en kopia av cache
  }
  
  try {
    const clientsRef = ref(db, DB_PATH);
    console.log('getAllClients: Skapad referens till', DB_PATH);
    
    // Lägg till timeout för att undvika att hämtningen hänger
    const fetchPromise = get(clientsRef);
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject(new Error('Database operation timed out after 8 seconds'));
      }, 8000); // 8 sekunder timeout
    });
    
    // Race mellan fetchPromise och timeoutPromise
    const snapshot = await Promise.race([fetchPromise, timeoutPromise])
      .catch(error => {
        console.error('getAllClients: Timeout eller fel vid hämtning:', error);
        
        // Om vi har cache, returnera den även om den är gammal
        if (clientCache) {
          console.log('getAllClients: Returnerar gammal cache vid nätverksfel');
          return { exists: () => true, val: () => clientCache } as unknown as DataSnapshot;
        }
        
        throw error;
      }) as DataSnapshot;
    
    console.log('getAllClients: Hämtade snapshot, exists:', snapshot.exists());
    
    if (!snapshot.exists()) {
      console.log('getAllClients: Inga klienter hittades');
      clientCache = [];
      lastCacheTime = now;
      return [];
    }
    
    const data = snapshot.val();
    
    // Om data är en array, hantera det direkt
    if (Array.isArray(data)) {
      console.log('getAllClients: Data är en array, längd:', data.length);
      const filteredClients = data.filter(Boolean).map((client, index) => {
        try {
          if (client.testDatum) {
            client.testDatum = Object.assign(new RTDBTimestamp(), client.testDatum);
          }
          if (client.skapadDatum) {
            client.skapadDatum = Object.assign(new RTDBTimestamp(), client.skapadDatum);
          }
          return { id: index.toString(), ...client } as Client;
        } catch (e) {
          console.error('getAllClients: Fel vid bearbetning av klient:', e);
          return null;
        }
      }).filter(Boolean) as Client[];
      
      clientCache = filteredClients;
      lastCacheTime = now;
      return [...filteredClients];
    }
    
    // Annars hantera som objekt med nycklar
    console.log('getAllClients: Antal klienter hittade:', Object.keys(data).length);
    
    const clients = Object.keys(data).map(key => {
      try {
        const client = data[key];
        
        // Konvertera timestamp-objekt till RTDBTimestamp-instanser
        if (client.testDatum) {
          client.testDatum = Object.assign(new RTDBTimestamp(), client.testDatum);
        }
        
        if (client.skapadDatum) {
          client.skapadDatum = Object.assign(new RTDBTimestamp(), client.skapadDatum);
        }
        
        return { id: key, ...client } as Client;
      } catch (error) {
        console.error('getAllClients: Fel vid konvertering av tidsstämplar för klient:', key, error);
        return null;
      }
    }).filter(Boolean) as Client[];
    
    const endTime = performance.now();
    console.log(`getAllClients: Färdig med ${clients.length} klienter på ${(endTime - startTime).toFixed(2)} ms`);
    
    // Uppdatera cache
    clientCache = clients;
    lastCacheTime = now;
    
    return [...clients];
  } catch (error) {
    console.error('getAllClients: Fel vid hämtning:', error);
    
    // Om vi har cache, returnera den vid fel
    if (clientCache) {
      console.log('getAllClients: Returnerar cache vid fel');
      return [...clientCache];
    }
    
    throw error;
  }
}

// Lägg till ny klient
export async function addClient(client: Omit<Client, 'id' | 'skapadDatum'>): Promise<string> {
  try {
    // Invalidera cache
    clientCache = null;
    
    const clientsRef = ref(db, DB_PATH);
    const newClientRef = push(clientsRef);
    
    const clientWithDate = {
      ...client,
      skapadDatum: RTDBTimestamp.now()
    };
    
    await set(newClientRef, clientWithDate);
    return newClientRef.key || '';
  } catch (error) {
    console.error('addClient: Fel vid tillägg av klient:', error);
    throw error;
  }
}

// Uppdatera klient
export async function updateClient(id: string, data: Partial<Client>): Promise<void> {
  try {
    // Invalidera cache
    clientCache = null;
    
    const clientRef = ref(db, `${DB_PATH}/${id}`);
    await update(clientRef, data);
  } catch (error) {
    console.error('updateClient: Fel vid uppdatering av klient:', error);
    throw error;
  }
}

// Ta bort klient
export async function deleteClient(id: string): Promise<void> {
  try {
    // Invalidera cache
    clientCache = null;
    
    const clientRef = ref(db, `${DB_PATH}/${id}`);
    await remove(clientRef);
  } catch (error) {
    console.error('deleteClient: Fel vid borttagning av klient:', error);
    throw error;
  }
}

// Hämta klient med ID
export async function getClientById(id: string): Promise<Client | null> {
  try {
    // Kontrollera cache först
    if (clientCache) {
      const cachedClient = clientCache.find(client => client.id === id);
      if (cachedClient) {
        console.log('getClientById: Returnerar klient från cache', id);
        return { ...cachedClient };
      }
    }
    
    const clientRef = ref(db, `${DB_PATH}/${id}`);
    const snapshot = await get(clientRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const client = snapshot.val();
    
    // Konvertera timestamp-objekt till RTDBTimestamp-instanser
    if (client.testDatum) {
      client.testDatum = Object.assign(new RTDBTimestamp(), client.testDatum);
    }
    
    if (client.skapadDatum) {
      client.skapadDatum = Object.assign(new RTDBTimestamp(), client.skapadDatum);
    }
    
    return { id, ...client } as Client;
  } catch (error) {
    console.error('getClientById: Fel vid hämtning av klient:', error);
    throw error;
  }
}

// Hämta klienter med testdatum inom ett intervall
export async function getClientsByTestDate(startDate: Date, endDate: Date): Promise<Client[]> {
  try {
    // Hämta alla klienter - använder cache automatiskt
    const clients = await getAllClients();
    
    return clients.filter(client => {
      if (!client.testDatum) return false;
      
      const testDate = client.testDatum.toDate();
      return testDate >= startDate && testDate <= endDate;
    });
  } catch (error) {
    console.error('getClientsByTestDate: Fel vid filtrering efter datum:', error);
    throw error;
  }
} 