'use client';

import Navbar from '@/components/Navbar';
import AuthCheck from '@/components/AuthCheck';
import AuthProvider from '@/components/AuthProvider';
import NotificationChecker from '@/components/NotificationChecker';
import FirebaseErrorFallback from '@/components/FirebaseErrorFallback';
import { useEffect, useState } from 'react';
import { initializeDatabase } from '@/lib/firebase/dbInitializer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dbError, setDbError] = useState<string | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  // Initiera databasen när layouten laddas
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('Layout: Startar databasinitalisering');
        await initializeDatabase();
        console.log('Layout: Databasinitalisering slutförd');
        setInitAttempted(true);
      } catch (error) {
        console.error('Layout: Fel vid databasinitalisering:', error);
        setDbError('Kunde inte ansluta till databasen. Vänligen kontrollera din anslutning.');
        setInitAttempted(true);
      }
    };

    // Sätt en timeout för att markera att vi försökt initialisera även om det aldrig svarar
    const timeoutId = setTimeout(() => {
      if (!initAttempted) {
        console.log('Layout: Timeout för databasinitalisering efter 5 sekunder');
        setDbError('Timeout vid anslutning till databasen. Vänligen kontrollera din anslutning.');
        setInitAttempted(true);
      }
    }, 5000);

    initDb();

    return () => clearTimeout(timeoutId);
  }, []);

  // Om vi har ett allvarligt fel, visa fallback-komponenten
  if (dbError && dbError.includes('Timeout')) {
    return <FirebaseErrorFallback />;
  }

  return (
    <AuthProvider>
      <AuthCheck>
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
            {dbError && (
              <div className="bg-light-error/10 dark:bg-dark-error/10 border border-light-error dark:border-dark-error text-light-error dark:text-dark-error rounded-lg px-6 py-5 mb-6 shadow-light-sm dark:shadow-dark-sm backdrop-blur-sm">
                <p className="font-medium">{dbError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 px-4 py-2 bg-light-error hover:bg-light-error/90 dark:bg-dark-error dark:hover:bg-dark-error/90 text-white rounded-md"
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
