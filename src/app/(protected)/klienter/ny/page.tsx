'use client';

import ClientForm from '@/components/ClientForm';

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight mb-8">Lägg till ny klient</h1>
      <ClientForm />
    </div>
  );
} 