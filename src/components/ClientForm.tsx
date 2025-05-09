import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { addClient, updateClient, getClientById, Client } from '@/lib/firebase/clientService';

interface ClientFormProps {
  clientId?: string;
}

// Typ för formulärdata
interface FormData {
  namn: string;
  telefon: string;
  email: string;
  testDatum: string;
  anteckningar: string;
}

// Typ för data som ska skickas till databasen
type ClientDataToSave = Omit<Client, 'id' | 'skapadDatum'> & {
  skapadDatum?: Timestamp;
};

export default function ClientForm({ clientId }: ClientFormProps) {
  const router = useRouter();
  const isEditing = !!clientId;

  const [formData, setFormData] = useState<FormData>({
    namn: '',
    telefon: '',
    email: '',
    testDatum: '',
    anteckningar: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingClient, setLoadingClient] = useState(isEditing);

  useEffect(() => {
    if (clientId) {
      fetchClient(clientId);
    }
  }, [clientId]);

  const fetchClient = async (id: string) => {
    try {
      setLoadingClient(true);
      const client = await getClientById(id);
      
      if (client) {
        // Formatera datum från Timestamp till HTML-datum (YYYY-MM-DD)
        let testDatumString = '';
        if (client.testDatum) {
          const date = client.testDatum.toDate();
          testDatumString = date.toISOString().split('T')[0];
        }

        setFormData({
          namn: client.namn,
          telefon: client.telefon,
          email: client.email,
          testDatum: testDatumString,
          anteckningar: client.anteckningar || ''
        });
      }
    } catch (err) {
      console.error('Fel vid hämtning av klient:', err);
      setError('Kunde inte hämta klientinformation.');
    } finally {
      setLoadingClient(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const clientData: ClientDataToSave = {
        namn: formData.namn,
        telefon: formData.telefon,
        email: formData.email,
        anteckningar: formData.anteckningar
      };

      // Lägg till testdatum om det finns
      if (formData.testDatum) {
        clientData.testDatum = Timestamp.fromDate(new Date(formData.testDatum));
      }

      if (isEditing && clientId) {
        await updateClient(clientId, clientData);
      } else {
        await addClient(clientData);
      }

      router.push('/klienter');
    } catch (err) {
      console.error('Fel vid sparande av klient:', err);
      setError('Kunde inte spara klientinformation. Kontrollera att alla obligatoriska fält är ifyllda.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300 font-medium">Laddar klientdata...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg dark:bg-card-bg backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-5 py-4 mb-6 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="namn" className="block text-gray-900 dark:text-white font-medium mb-2">
          Namn *
        </label>
        <input
          type="text"
          id="namn"
          name="namn"
          value={formData.namn}
          onChange={handleChange}
          required
          className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary/50 dark:focus:ring-primary/30 focus:border-primary dark:focus:border-primary"
          placeholder="Ange klientens namn"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="telefon" className="block text-gray-900 dark:text-white font-medium mb-2">
          Telefon *
        </label>
        <input
          type="tel"
          id="telefon"
          name="telefon"
          value={formData.telefon}
          onChange={handleChange}
          required
          className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary/50 dark:focus:ring-primary/30 focus:border-primary dark:focus:border-primary"
          placeholder="Ange telefonnummer"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-900 dark:text-white font-medium mb-2">
          E-post *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary/50 dark:focus:ring-primary/30 focus:border-primary dark:focus:border-primary"
          placeholder="Ange e-postadress"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="testDatum" className="block text-gray-900 dark:text-white font-medium mb-2">
          Testdatum
        </label>
        <div className="relative">
          <input
            type="date"
            id="testDatum"
            name="testDatum"
            value={formData.testDatum}
            onChange={handleChange}
            className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary/50 dark:focus:ring-primary/30 focus:border-primary dark:focus:border-primary"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="anteckningar" className="block text-gray-900 dark:text-white font-medium mb-2">
          Anteckningar
        </label>
        <textarea
          id="anteckningar"
          name="anteckningar"
          value={formData.anteckningar}
          onChange={handleChange}
          rows={4}
          className="w-full bg-white dark:bg-secondary text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-primary/50 dark:focus:ring-primary/30 focus:border-primary dark:focus:border-primary"
          placeholder="Lägg till valfria anteckningar"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sparar...' : isEditing ? 'Uppdatera' : 'Spara'}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/klienter')}
          className="bg-secondary dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
} 