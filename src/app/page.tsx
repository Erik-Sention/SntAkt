'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Redirectar till inloggningssidan...');
      router.push('/login');
      
      // Om redirecten inte utförs inom 2 sekunder, visa en länk istället
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    } catch (err) {
      console.error('Fel vid redirect:', err);
      setError('Det gick inte att navigera automatiskt till inloggningssidan.');
      setIsLoading(false);
    }
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Navigationsproblem</h1>
        <p className="mb-6 text-center">{error}</p>
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Gå till inloggningssidan
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Klienthantering</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Laddar inloggningssidan...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-6 text-center">Om du inte automatiskt skickas vidare, klicka på knappen nedan:</p>
          <Link 
            href="/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Gå till inloggningssidan
          </Link>
        </div>
      )}
    </div>
  );
}
