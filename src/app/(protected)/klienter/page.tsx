'use client';

import { useState, useEffect } from 'react';
import { getAllClients, deleteClient, Client, RTDBTimestamp } from '@/lib/firebase/clientService';
import Link from 'next/link';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function KlienterPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

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
  }, []);

  const fetchClients = async () => {
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
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Laddar klienter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Klienter</h1>
          <Link 
            href="/klienter/ny" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lägg till klient
          </Link>
        </div>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <p>{error}</p>
            <button 
              onClick={() => {
                setTimeoutOccurred(false);
                setError('');
                fetchClients();
              }}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Försök igen
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Kunde inte visa klienter.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Klienter</h1>
        <Link 
          href="/klienter/ny" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Lägg till klient
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Inga klienter hittades.</p>
          <p className="mt-2">
            <Link 
              href="/klienter/ny" 
              className="text-blue-600 hover:underline"
            >
              Lägg till din första klient
            </Link>
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Namn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testdatum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skapad
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.namn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.telefon}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(client.testDatum)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(client.skapadDatum)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/klienter/${client.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Redigera
                    </Link>
                    <button 
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 