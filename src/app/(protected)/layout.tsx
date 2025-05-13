'use client';

import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';
import AuthProvider from '@/components/AuthProvider';
import NotificationChecker from '@/components/NotificationChecker';
import { useEffect, useState } from 'react';
import { initializeDatabase } from '@/lib/firebase/dbInitializer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Initiera databasen när layouten laddas
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('Layout: Startar databasinitalisering');
        await initializeDatabase();
        console.log('Layout: Databasinitalisering slutförd');
        setDbInitialized(true);
      } catch (error) {
        console.error('Layout: Fel vid databasinitalisering:', error);
        setDbError('Kunde inte ansluta till databasen. Vänligen kontrollera din anslutning.');
        // Sätt ändå dbInitialized till true för att låta användaren fortsätta
        setDbInitialized(true);
      }
    };

    initDb();
  }, []);

  return (
    <AuthProvider>
      <AuthCheck>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            {dbError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{dbError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Försök igen
                </button>
              </div>
            )}
            {children}
          </main>
          <NotificationChecker />
        </div>
      </AuthCheck>
    </AuthProvider>
  );
}
