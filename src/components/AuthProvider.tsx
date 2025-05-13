'use client';

import { ReactNode, createContext, useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Startar autentiseringslyssnare');
    
    // Sätt en timeout för att undvika fastnad i laddningstillstånd
    const timeoutId = setTimeout(() => {
      console.log('AuthProvider: Auth timeout - sätter loading till false');
      setLoading(false);
    }, 5000);
    
    try {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        console.log('AuthProvider: Auth state ändrad', authUser ? 'Inloggad' : 'Utloggad');
        
        clearTimeout(timeoutId);
        
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
        console.log('AuthProvider: Loading state satt till false');
      });

      return () => {
        console.log('AuthProvider: Rensar autentiseringslyssnare');
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (error) {
      console.error('AuthProvider: Fel vid autentiseringslyssnare:', error);
      clearTimeout(timeoutId);
      setLoading(false);
      return () => {};
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 