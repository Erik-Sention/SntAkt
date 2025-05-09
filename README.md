# Klienthantering och Aktivitetssektion

## Om projektet

En webbapplikation för att hantera klienter, schemalägga tester och få notifieringar om kommande tester.

## Teknisk Stack

- Next.js med App Router och TypeScript
- Tailwind CSS för styling
- Firebase för autentisering och datalagring

## Nyligen uppdaterade funktioner

### Konvertering till Realtime Database

Projektet har konverterats från Firebase Firestore till Firebase Realtime Database. Detta inkluderar:

1. Uppdaterad databasåtkomst i alla servicefiler
2. Implementering av `RTDBTimestamp` för att bevara kompatibilitet med kodbasen
3. Förbättrad filtrering av data på klientsidan

## Konfiguration

För att köra projektet lokalt behöver du:

1. Klona repot
2. Kör `npm install` för att installera beroenden
3. Skapa en `.env.local`-fil med följande innehåll:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=ditt-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=din-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=ditt-project-id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://ditt-project-id.firebaseio.com
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ditt-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ditt-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=ditt-app-id
   ```
4. Kör `npm run dev` för att starta utvecklingsservern

## Datastruktur (Realtime Database)

```
{
  "klienter": {
    "uniqueId1": {
      "namn": "Klientnamn",
      "telefon": "0701234567",
      "email": "klient@example.com",
      "testDatum": { "seconds": 1234567890, "nanoseconds": 0 },
      "anteckningar": "Anteckningar om klienten",
      "skapadDatum": { "seconds": 1234567890, "nanoseconds": 0 }
    },
    "uniqueId2": {
      ...
    }
  }
}
```

## Funktioner

- **Autentisering**: Endast inloggade användare kan använda applikationen.
- **Klienthantering**: Skapa, visa och redigera klientinformation.
- **Testkalender**: Visa schemalagda test i en kalendervy.
- **Notifieringar**: Systemet kontrollerar dagligen om det finns klienter med test om en vecka och skickar e-postmeddelanden.

## Installation

1. Klona projektet:
   ```
   git clone [repository-url]
   cd [projekt-katalog]
   ```

2. Installera beroenden:
   ```
   npm install
   ```

3. Skapa en `.env.local` fil i projektets rot med följande innehåll:
   ```
   # Firebase-konfiguration
   NEXT_PUBLIC_FIREBASE_API_KEY=din-api-nyckel
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ditt-projekt.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=ditt-projekt-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ditt-projekt.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=din-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=din-app-id
   ```

4. Starta utvecklingsservern:
   ```
   npm run dev
   ```

5. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Firebase-konfiguration

### Autentisering
1. Aktivera e-post/lösenordsautentisering i Firebase Console.
2. Skapa användare manuellt i Firebase Authentication.

### Firestore-databas
1. Skapa en Firestore-databas.
2. Lägg till följande säkerhetsregler för att endast tillåta autentiserade användare:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Cloud Functions (för notifieringar)
1. Konfigurera Firebase Cloud Functions för att hantera e-postnotifieringar.
2. Exempel på Cloud Function för e-post finns i `functions/`-katalogen.

## Utveckling

- **Frontend**: Next.js och React används för användargränssnittet.
- **Styling**: Tailwind CSS används för styling.
- **Databas**: Firebase Firestore används för datalagring.
- **Autentisering**: Firebase Authentication hanterar användarinloggning.

## Licens

Detta projekt är licensierat under [MIT-licensen](LICENSE).
