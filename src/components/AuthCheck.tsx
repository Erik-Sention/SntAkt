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

  useEffect(() => {
    // Om laddning pågår, starta en timer
    if (loading) {
      console.log('AuthCheck: Startar timeout för autentisering');
      const timeoutId = setTimeout(() => {
        console.log('AuthCheck: Timeout efter 8 sekunder, antar att användaren inte är inloggad');
        setAuthTimeout(true);
      }, 8000); // 8 sekunder timeout
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [loading]);

  useEffect(() => {
    if ((!loading && !user) || authTimeout) {
      console.log('AuthCheck: Användare inte autentiserad, omdirigerar till login');
      router.push('/login');
    }
  }, [user, loading, router, authTimeout]);

  // Visa laddningsindikator endast om vi faktiskt laddar och inte har timeat ut
  if (loading && !authTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Kontrollerar behörighet...</p>
      </div>
    );
  }

  // Om autentiseringen tar för lång tid eller användaren inte är inloggad
  if (authTimeout || (!loading && !user)) {
    return null;
  }

  return <>{children}</>;
} 