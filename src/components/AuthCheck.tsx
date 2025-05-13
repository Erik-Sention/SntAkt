'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

type AuthCheckProps = {
  children: ReactNode;
};

export default function AuthCheck({ children }: AuthCheckProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authTimeout, setAuthTimeout] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Om laddning pågår, starta en timer
    if (loading) {
      console.log('AuthCheck: Startar timeout för autentisering');
      const timeoutId = setTimeout(() => {
        console.log('AuthCheck: Timeout efter 5 sekunder, antar att användaren inte är inloggad');
        setAuthTimeout(true);
      }, 5000); // 5 sekunder timeout
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [loading]);

  useEffect(() => {
    if ((!loading && !user) || authTimeout) {
      if (!redirecting) {
        console.log('AuthCheck: Användare inte autentiserad, omdirigerar till login');
        setRedirecting(true);
        router.push('/login');
      }
    }
  }, [user, loading, router, authTimeout, redirecting]);

  // Visa laddningsindikator endast om vi faktiskt laddar och inte har timeat ut
  if ((loading && !authTimeout) || (!user && !redirecting)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Kontrollerar behörighet...</p>
      </div>
    );
  }

  // Om användaren är autentiserad, visa innehållet
  if (user) {
    return <>{children}</>;
  }

  // Annars, visa ingenting medan omdirigering pågår
  return null;
} 