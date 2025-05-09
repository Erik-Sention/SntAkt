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
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight mb-8">Redigera klient</h1>
      <ClientForm clientId={id} />
    </div>
  );
} 