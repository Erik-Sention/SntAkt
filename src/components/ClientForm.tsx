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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="namn" className="block text-gray-700 font-medium mb-2">
          Namn *
        </label>
        <input
          type="text"
          id="namn"
          name="namn"
          value={formData.namn}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="telefon" className="block text-gray-700 font-medium mb-2">
          Telefon *
        </label>
        <input
          type="tel"
          id="telefon"
          name="telefon"
          value={formData.telefon}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          E-post *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="testDatum" className="block text-gray-700 font-medium mb-2">
          Testdatum
        </label>
        <input
          type="date"
          id="testDatum"
          name="testDatum"
          value={formData.testDatum}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="anteckningar" className="block text-gray-700 font-medium mb-2">
          Anteckningar
        </label>
        <textarea
          id="anteckningar"
          name="anteckningar"
          value={formData.anteckningar}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sparar...' : isEditing ? 'Uppdatera' : 'Spara'}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/klienter')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
} 