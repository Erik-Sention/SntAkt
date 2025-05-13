import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/klienter" className="flex items-center">
      <span className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-xl mr-2 text-white font-semibold text-xl">
        K
      </span>
      <span className="text-xl font-semibold text-gray-900 tracking-tight">
        Klienthantering
      </span>
    </Link>
  );
} 