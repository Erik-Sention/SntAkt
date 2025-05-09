'use client';

import { useState, useEffect } from 'react';
import { getAllClients, Client } from '@/lib/firebase/clientService';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function KalenderPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      
      // Filtrera ut klienter som har testdatum
      const clientsWithTest = data.filter(client => client.testDatum);
      setClients(clientsWithTest);
      setError('');
    } catch (err) {
      console.error('Fel vid hämtning av klienter:', err);
      setError('Kunde inte hämta kalenderdata. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Skapa en array med veckodagar (mån-sön)
    const weekDays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: sv })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium py-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs tracking-wider">
              {day}
            </div>
          ))}

          {/* Tomma celler för dagar innan månadens start */}
          {Array.from({ length: (monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1) }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-28 bg-white/60 dark:bg-gray-900/60"></div>
          ))}

          {/* Dagar i månaden */}
          {daysInMonth.map(day => {
            // Hitta klienter med test på denna dag
            const clientsOnDay = clients.filter(client => 
              client.testDatum && isSameDay(client.testDatum.toDate(), day)
            );

            return (
              <div 
                key={day.toISOString()} 
                className={`h-28 p-2 overflow-y-auto bg-white dark:bg-gray-900 ${
                  isSameDay(day, new Date()) 
                    ? 'ring-2 ring-primary ring-inset' 
                    : ''
                }`}
              >
                <div className={`text-right text-sm font-medium mb-1 ${
                  isSameDay(day, new Date())
                    ? 'text-primary dark:text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {format(day, 'd', { locale: sv })}
                </div>
                
                {clientsOnDay.map(client => (
                  <Link
                    key={client.id}
                    href={`/klienter/${client.id}`}
                    className="block p-1.5 mb-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary rounded-md transition-colors truncate"
                  >
                    {client.namn}
                  </Link>
                ))}
              </div>
            );
          })}

          {/* Tomma celler för dagar efter månadens slut */}
          {Array.from({ length: (monthEnd.getDay() === 0 ? 0 : 7 - monthEnd.getDay()) }).map((_, index) => (
            <div key={`empty-end-${index}`} className="h-28 bg-white/60 dark:bg-gray-900/60"></div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium">Laddar kalender...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Testkalender</h1>
        <Link 
          href="/klienter/ny" 
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
        >
          Lägg till klient
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-6 py-5 text-red-700 dark:text-red-400 shadow-sm backdrop-blur-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {renderCalendar()}

      <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <h2 className="text-lg font-semibold border-b border-gray-100 dark:border-gray-800 p-5 text-gray-900 dark:text-white">Kommande tester</h2>
        {clients.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Inga planerade tester hittades</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {clients
              .filter(client => client.testDatum && client.testDatum.toDate() >= new Date())
              .sort((a, b) => {
                if (a.testDatum && b.testDatum) {
                  return a.testDatum.toDate().getTime() - b.testDatum.toDate().getTime();
                }
                return 0;
              })
              .map(client => (
                <li key={client.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{client.namn}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Test: {client.testDatum && format(client.testDatum.toDate(), 'd MMMM yyyy', { locale: sv })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{client.telefon}</p>
                    </div>
                    <Link
                      href={`/klienter/${client.id}`}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full text-sm transition-colors"
                    >
                      Redigera
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
} 