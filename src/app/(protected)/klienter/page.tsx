'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllClients, deleteClient, Client, RTDBTimestamp } from '@/lib/firebase/clientService';
import Link from 'next/link';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function KlienterPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  const fetchClients = useCallback(async () => {
    console.log('KlienterPage: fetchClients startar');
    try {
      if (timeoutOccurred) return; // Fortsätt inte om timeout redan inträffat
      
      setLoading(true);
      console.log('KlienterPage: Loading state satt till true');
      
      console.log('KlienterPage: Anropar getAllClients');
      const data = await getAllClients();
      console.log(`KlienterPage: Data mottagen från getAllClients, antal: ${data.length}`);
      
      // Kontrollera om komponentens tillstånd fortfarande är relevant
      if (timeoutOccurred) return;
      
      setClients(data);
      console.log('KlienterPage: Client state uppdaterad');
      
      setError('');
    } catch (err) {
      console.error('KlienterPage: Fel vid hämtning av klienter:', err);
      setError('Kunde inte hämta klienter. Försök igen senare.');
    } finally {
      if (!timeoutOccurred) {
        setLoading(false);
        console.log('KlienterPage: Loading state satt till false');
      }
    }
  }, [timeoutOccurred]);

  useEffect(() => {
    console.log('KlienterPage: useEffect körs, startar fetchClients');
    
    // Definiera en timeout för att avbryta laddning om det tar för lång tid
    const timeoutId = setTimeout(() => {
      console.log('KlienterPage: Timeout efter 10 sekunder, avbryter laddning');
      setTimeoutOccurred(true);
      setLoading(false);
      setError('Tidsfristen för att hämta data överskreds. Vänligen kontrollera din anslutning och försök igen.');
    }, 10000); // 10 sekunder timeout
    
    fetchClients()
      .finally(() => {
        // Rensa timeout om laddningen slutförs normalt
        clearTimeout(timeoutId);
      });
      
    return () => {
      // Rensa timeout om komponenten avmonteras
      clearTimeout(timeoutId);
    };
  }, [fetchClients]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      setError('Kan inte ta bort klient: ID saknas');
      return;
    }
    
    if (window.confirm('Är du säker på att du vill ta bort denna klient?')) {
      try {
        await deleteClient(id);
        setClients(prevClients => prevClients.filter(client => {
          return !client.id || client.id !== id;
        }));
      } catch (err) {
        console.error('Fel vid borttagning av klient:', err);
        setError('Kunde inte ta bort klienten. Försök igen senare.');
      }
    }
  };

  const formatDate = (timestamp: RTDBTimestamp | undefined) => {
    if (!timestamp) return '-';
    try {
      return format(timestamp.toDate(), 'd MMMM yyyy', { locale: sv });
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Laddar klienter...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Klienter</h1>
        <Link 
          href="/klienter/ny" 
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
        >
          Lägg till klient
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-6 py-5 text-red-700 dark:text-red-400 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => {
                setTimeoutOccurred(false);
                setError('');
                fetchClients();
              }}
              className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors"
            >
              Försök igen
            </button>
          </div>
        </div>
      )}

      {clients.length === 0 && !error ? (
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">Inga klienter hittades</p>
          <Link 
            href="/klienter/ny" 
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Lägg till din första klient
          </Link>
        </div>
      ) : clients.length > 0 ? (
        <div className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Namn
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Testdatum
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Skapad
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{client.namn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{client.telefon}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(client.testDatum)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(client.skapadDatum)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/klienter/${client.id}`}
                          className="text-primary hover:text-primary-dark transition-colors"
                        >
                          Redigera
                        </Link>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          Ta bort
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
} 