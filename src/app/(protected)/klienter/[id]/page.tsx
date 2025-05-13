'use client';

import { use } from 'react';
import ClientForm from '@/components/ClientForm';

type PageParams = {
  params: Promise<{ id: string }>;
};

export default function EditClientPage({ params }: PageParams) {
  // Använd React.use() för att packa upp params
  const { id } = use(params);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Redigera klient</h1>
      <ClientForm clientId={id} />
    </div>
  );
} 