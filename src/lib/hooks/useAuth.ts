import { useAuthContext } from '@/components/AuthProvider';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const signOut = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Fel vid utloggning:', error);
    }
  };

  return { user, loading, signOut };
} 