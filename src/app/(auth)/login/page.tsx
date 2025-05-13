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
      console.log('Försöker logga in med:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Inloggning lyckades');
      router.push('/klienter');
    } catch (err: unknown) {
      console.error('Inloggningsfel:', err);
      setError('Felaktigt användarnamn eller lösenord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600 dark:text-blue-500">Klienthantering</h1>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              required
              placeholder="din@email.se"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              required
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  );
} 