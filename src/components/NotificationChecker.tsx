'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getClientsWithUpcomingTests, sendEmailNotification, generateEmailContent } from '@/lib/firebase/notificationService';

export default function NotificationChecker() {
  const [checking, setChecking] = useState(false);
  const { user } = useAuth();

  // Hjälpfunktion för att avgöra om det är en ny dag
  const isNewDay = (dateString: string): boolean => {
    const lastDate = new Date(dateString);
    const today = new Date();
    
    return (
      lastDate.getDate() !== today.getDate() ||
      lastDate.getMonth() !== today.getMonth() ||
      lastDate.getFullYear() !== today.getFullYear()
    );
  };

  // Funktion för att kontrollera kommande tester och skicka notifieringar
  const checkForUpcomingTests = useCallback(async () => {
    if (checking) return;
    
    try {
      setChecking(true);
      
      // Hämta klienter med test om en vecka
      const upcomingClients = await getClientsWithUpcomingTests();
      
      if (upcomingClients.length > 0) {
        // Generera e-postinnehåll
        const { subject, content } = generateEmailContent(upcomingClients);
        
        // Skicka notifiering - i en riktig implementation skulle du skicka till riktiga administratörer
        // Här använder vi en platshållare för demo
        await sendEmailNotification(['admin@example.com'], subject, content);
        
        console.log(`Notifiering skickad för ${upcomingClients.length} klienter med kommande tester.`);
      } else {
        console.log('Inga klienter med test om en vecka hittades.');
      }
      
      // Uppdatera senaste kontroll
      const now = new Date().toISOString();
      localStorage.setItem('lastNotificationCheck', now);
      
    } catch (error) {
      console.error('Fel vid kontroll av kommande tester:', error);
    } finally {
      setChecking(false);
    }
  }, [checking]);

  // Kontrollera för notifieringar när komponenten monteras och användaren är inloggad
  useEffect(() => {
    if (!user) return;

    const storedLastCheck = localStorage.getItem('lastNotificationCheck');
    
    // Kör endast en gång per dag
    const shouldCheck = !storedLastCheck || isNewDay(storedLastCheck);
    
    if (shouldCheck) {
      checkForUpcomingTests();
    }
  }, [user, checkForUpcomingTests]);

  // Denna komponent renderar ingenting synligt
  return null;
} 