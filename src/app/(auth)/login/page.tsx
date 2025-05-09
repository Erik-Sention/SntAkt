'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/klienter');
    } catch (err: unknown) {
      console.error('Inloggningsfel:', err);
      setError('Felaktigt användarnamn eller lösenord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-lg shadow-light-md dark:shadow-dark-md w-full max-w-md border border-light-border dark:border-dark-border">
        <h1 className="text-2xl font-bold text-center mb-6 text-light-primary dark:text-dark-primary">Klienthantering</h1>
        
        {error && (
          <div className="bg-light-error/10 dark:bg-dark-error/10 border border-light-error dark:border-dark-error text-light-error dark:text-dark-error px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-light-text-secondary dark:text-dark-text-secondary font-medium mb-1">
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
              placeholder="din@email.se"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-light-text-secondary dark:text-dark-text-secondary font-medium mb-1">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  );
} 