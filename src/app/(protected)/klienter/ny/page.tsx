'use client';

import ClientForm from '@/components/ClientForm';

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lägg till ny klient</h1>
      <ClientForm />
    </div>
  );
} 