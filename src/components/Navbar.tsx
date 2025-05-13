import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">Klienthantering</div>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
          <Link 
            href="/klienter" 
            className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/klienter')}`}
          >
            Klienter
          </Link>
          
          <Link 
            href="/kalender" 
            className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/kalender')}`}
          >
            Kalender
          </Link>
          
          <button 
            onClick={signOut}
            className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition"
          >
            Logga ut
          </button>
        </div>
      </div>
    </nav>
  );
} 