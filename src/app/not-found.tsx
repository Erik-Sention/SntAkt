import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Sidan kunde inte hittas</h2>
      <p className="mb-8 text-center">Sidan du letar efter finns inte eller har flyttats.</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Tillbaka till startsidan
      </Link>
    </div>
  );
} 