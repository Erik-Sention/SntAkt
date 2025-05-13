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
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            &lt; Föregående
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: sv })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            Nästa &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium py-2 bg-gray-50">
              {day}
            </div>
          ))}

          {/* Tomma celler för dagar innan månadens start */}
          {Array.from({ length: (monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1) }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-24 border bg-gray-50"></div>
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
                className={`h-24 border p-1 overflow-y-auto ${
                  isSameDay(day, new Date()) ? 'bg-blue-50 border-blue-300' : ''
                }`}
              >
                <div className="text-right text-sm font-medium mb-1">
                  {format(day, 'd', { locale: sv })}
                </div>
                
                {clientsOnDay.map(client => (
                  <Link
                    key={client.id}
                    href={`/klienter/${client.id}`}
                    className="block p-1 mb-1 text-xs bg-blue-100 hover:bg-blue-200 rounded transition truncate"
                  >
                    {client.namn}
                  </Link>
                ))}
              </div>
            );
          })}

          {/* Tomma celler för dagar efter månadens slut */}
          {Array.from({ length: (monthEnd.getDay() === 0 ? 0 : 7 - monthEnd.getDay()) }).map((_, index) => (
            <div key={`empty-end-${index}`} className="h-24 border bg-gray-50"></div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testkalender</h1>
        <Link 
          href="/klienter/ny" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Lägg till klient
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {renderCalendar()}

      <div className="mt-8 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold border-b p-4">Kommande tester</h2>
        {clients.length === 0 ? (
          <p className="p-4 text-gray-600">Inga planerade tester hittades.</p>
        ) : (
          <ul className="divide-y">
            {clients
              .filter(client => client.testDatum && client.testDatum.toDate() >= new Date())
              .sort((a, b) => {
                if (a.testDatum && b.testDatum) {
                  return a.testDatum.toDate().getTime() - b.testDatum.toDate().getTime();
                }
                return 0;
              })
              .map(client => (
                <li key={client.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{client.namn}</h3>
                      <p className="text-sm text-gray-600">
                        Test: {client.testDatum && format(client.testDatum.toDate(), 'd MMMM yyyy', { locale: sv })}
                      </p>
                      <p className="text-sm text-gray-600">{client.telefon}</p>
                    </div>
                    <Link
                      href={`/klienter/${client.id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-3 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-gray-500"
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