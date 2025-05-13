import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-light-surface/80 backdrop-blur-md border-b border-light-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/klienter" 
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive('/klienter') 
                ? 'bg-light-primary/10 text-light-primary' 
                : 'text-light-text-secondary hover:text-light-text'
            }`}
          >
            Klienter
          </Link>
          
          <Link 
            href="/kalender" 
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive('/kalender') 
                ? 'bg-light-primary/10 text-light-primary' 
                : 'text-light-text-secondary hover:text-light-text'
            }`}
          >
            Kalender
          </Link>
          
          <button 
            onClick={signOut}
            className="btn ml-3 px-4 py-2 rounded-full text-sm font-medium bg-light-error hover:bg-light-error/90 text-white"
            aria-label="Logga ut"
          >
            Logga ut
          </button>
        </div>
      </div>
    </nav>
  );
} 