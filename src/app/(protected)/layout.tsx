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
  const [dbError, setDbError] = useState<string | null>(null);

  // Initiera databasen när layouten laddas
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('Layout: Startar databasinitalisering');
        await initializeDatabase();
        console.log('Layout: Databasinitalisering slutförd');
      } catch (error) {
        console.error('Layout: Fel vid databasinitalisering:', error);
        setDbError('Kunde inte ansluta till databasen. Vänligen kontrollera din anslutning.');
      }
    };

    initDb();
  }, []);

  return (
    <AuthProvider>
      <AuthCheck>
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
          <Navbar />
          <main className="flex-grow container mx-auto px-6 py-8 max-w-7xl">
            {dbError && (
              <div className="bg-light-error/10 dark:bg-dark-error/10 border border-light-error dark:border-dark-error text-light-error dark:text-dark-error rounded-2xl px-6 py-5 mb-6 shadow-light-sm dark:shadow-dark-sm backdrop-blur-sm">
                <p className="font-medium">{dbError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 btn btn-primary bg-light-error hover:bg-light-error/90 dark:bg-dark-error dark:hover:bg-dark-error/90"
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
