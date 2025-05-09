import { functions } from './config';
import { httpsCallable } from 'firebase/functions';
import { addDays, format } from 'date-fns';
import { getClientsByTestDate, Client } from './clientService';
import { sv } from 'date-fns/locale';

// Funktion för att hämta klienter med test om en vecka
export async function getClientsWithUpcomingTests(): Promise<Client[]> {
  const today = new Date();
  const inOneWeek = addDays(today, 7);
  
  // Nollställ klockslag för att få hela dagen
  today.setHours(0, 0, 0, 0);
  inOneWeek.setHours(23, 59, 59, 999);
  
  try {
    const clients = await getClientsByTestDate(today, inOneWeek);
    return clients;
  } catch (error) {
    console.error('Fel vid hämtning av kommande tester:', error);
    throw error;
  }
}

// Funktion för att skicka e-postnotifieringar via Cloud Functions
export async function sendEmailNotification(
  recipients: string[], 
  subject: string, 
  content: string
): Promise<void> {
  try {
    const sendEmail = httpsCallable(functions, 'sendEmail');
    await sendEmail({ recipients, subject, content });
  } catch (error) {
    console.error('Fel vid skickande av e-post:', error);
    throw error;
  }
}

// Funktion för att generera innehåll för e-post
export function generateEmailContent(clients: Client[]): { subject: string, content: string } {
  const dateText = format(new Date(), 'd MMMM yyyy', { locale: sv });
  const subject = `Klienter med test om en vecka - ${dateText}`;
  
  let content = `<h1>Påminnelse: Klienter med test om en vecka</h1>
  <p>Följande klienter har ett inplanerat test om en vecka. Vänligen kontakta dem:</p>
  <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
    <tr style="background-color: #f2f2f2;">
      <th>Namn</th>
      <th>Telefon</th>
      <th>E-post</th>
      <th>Testdatum</th>
      <th>Anteckningar</th>
    </tr>`;
  
  clients.forEach(client => {
    if (client.testDatum) {
      const testDate = client.testDatum.toDate();
      const formattedDate = format(testDate, 'd MMMM yyyy', { locale: sv });
      
      content += `
      <tr>
        <td>${client.namn}</td>
        <td>${client.telefon}</td>
        <td>${client.email}</td>
        <td>${formattedDate}</td>
        <td>${client.anteckningar || ''}</td>
      </tr>`;
    }
  });
  
  content += `
  </table>
  <p>Detta är ett automatiskt genererat meddelande från klienthanteringssystemet.</p>`;
  
  return { subject, content };
} 